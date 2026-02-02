import { 
  users, profiles, locations, conversations, messages, blockedUsers, albums, photos,
  type User, type InsertUser, 
  type Profile, type InsertProfile,
  type Location, type InsertLocation,
  type Conversation, type Message, type InsertMessage,
  type BlockedUser, type Album, type InsertAlbum, type Photo, type InsertPhoto
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, ne, sql, lt, gt, asc } from "drizzle-orm";

export interface NearbyUser {
  userId: string;
  profile: Profile;
  location: { latitude: number; longitude: number; blurRadiusMeters: number };
  isOnline: boolean;
  distance: number; // in meters
}

export interface ConversationWithDetails {
  conversation: Conversation;
  otherUser: { id: string; profile: Profile; isOnline: boolean };
  lastMessage: Message | null;
  unreadCount: number;
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void>;

  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Locations
  getLocation(userId: string): Promise<Location | undefined>;
  upsertLocation(location: InsertLocation): Promise<Location>;
  getNearbyUsers(userId: string, latitude: number, longitude: number, radiusMeters: number): Promise<NearbyUser[]>;

  // Conversations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationBetweenUsers(userOneId: string, userTwoId: string): Promise<Conversation | undefined>;
  getConversationsForUser(userId: string): Promise<ConversationWithDetails[]>;
  createConversation(participantOneId: string, participantTwoId: string): Promise<Conversation>;

  // Messages
  getMessages(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;

  // Blocking
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  unblockUser(blockerId: string, blockedId: string): Promise<void>;
  isBlocked(userOneId: string, userTwoId: string): Promise<boolean>;
  getBlockedUsers(userId: string): Promise<BlockedUser[]>;

  // Albums
  getAlbums(userId: string): Promise<Album[]>;
  getAlbum(albumId: string): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  updateAlbum(albumId: string, updates: Partial<InsertAlbum>): Promise<Album | undefined>;
  deleteAlbum(albumId: string): Promise<void>;

  // Photos
  getPhotos(userId: string, albumId?: string): Promise<Photo[]>;
  getPhoto(photoId: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(photoId: string, updates: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(photoId: string): Promise<void>;
  setPrimaryPhoto(userId: string, photoId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await db.update(users)
      .set({ isOnline, lastSeenAt: new Date() })
      .where(eq(users.id, id));
  }

  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [updatedProfile] = await db.update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Locations
  async getLocation(userId: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.userId, userId));
    return location;
  }

  async upsertLocation(location: InsertLocation): Promise<Location> {
    const existing = await this.getLocation(location.userId);
    
    if (existing) {
      const [updated] = await db.update(locations)
        .set({ 
          latitude: location.latitude.toString(), 
          longitude: location.longitude.toString(),
          blurRadiusMeters: location.blurRadiusMeters,
          ghostModeEnabled: location.ghostModeEnabled ?? false,
          updatedAt: new Date() 
        })
        .where(eq(locations.userId, location.userId))
        .returning();
      return updated;
    }

    const [newLocation] = await db.insert(locations).values({
      userId: location.userId,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      blurRadiusMeters: location.blurRadiusMeters ?? 200,
      ghostModeEnabled: location.ghostModeEnabled ?? false,
    }).returning();
    return newLocation;
  }

  async getNearbyUsers(userId: string, latitude: number, longitude: number, radiusMeters: number): Promise<NearbyUser[]> {
    // Get blocked users first
    const blocked = await this.getBlockedUsers(userId);
    const blockedIds = blocked.map(b => b.blockedId);
    
    // Also get users who blocked the current user
    const blockedBy = await db.select().from(blockedUsers).where(eq(blockedUsers.blockedId, userId));
    const blockedByIds = blockedBy.map((b: BlockedUser) => b.blockerId);
    const allBlockedIds = Array.from(new Set([...blockedIds, ...blockedByIds]));

    // Get all locations (excluding ghost mode and blocked users)
    const allLocations = await db.select().from(locations)
      .where(and(
        ne(locations.userId, userId),
        eq(locations.ghostModeEnabled, false)
      ));

    const nearbyUsers: NearbyUser[] = [];

    for (const loc of allLocations) {
      if (allBlockedIds.includes(loc.userId)) continue;

      const locLat = parseFloat(loc.latitude);
      const locLng = parseFloat(loc.longitude);
      
      // Haversine distance calculation
      const R = 6371000; // Earth's radius in meters
      const dLat = (locLat - latitude) * Math.PI / 180;
      const dLng = (locLng - longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + 
                Math.cos(latitude * Math.PI / 180) * Math.cos(locLat * Math.PI / 180) * 
                Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance <= radiusMeters) {
        const profile = await this.getProfile(loc.userId);
        const user = await this.getUser(loc.userId);
        
        if (profile && user) {
          nearbyUsers.push({
            userId: loc.userId,
            profile,
            location: {
              latitude: locLat,
              longitude: locLng,
              blurRadiusMeters: loc.blurRadiusMeters,
            },
            isOnline: user.isOnline,
            distance: Math.round(distance),
          });
        }
      }
    }

    return nearbyUsers.sort((a, b) => a.distance - b.distance);
  }

  // Conversations
  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getConversationBetweenUsers(userOneId: string, userTwoId: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations)
      .where(or(
        and(eq(conversations.participantOneId, userOneId), eq(conversations.participantTwoId, userTwoId)),
        and(eq(conversations.participantOneId, userTwoId), eq(conversations.participantTwoId, userOneId))
      ));
    return conversation;
  }

  async getConversationsForUser(userId: string): Promise<ConversationWithDetails[]> {
    const userConversations = await db.select().from(conversations)
      .where(or(
        eq(conversations.participantOneId, userId),
        eq(conversations.participantTwoId, userId)
      ))
      .orderBy(desc(conversations.lastMessageAt));

    const result: ConversationWithDetails[] = [];

    for (const conv of userConversations) {
      const otherUserId = conv.participantOneId === userId ? conv.participantTwoId : conv.participantOneId;
      const [otherUser] = await db.select().from(users).where(eq(users.id, otherUserId));
      const otherProfile = await this.getProfile(otherUserId);

      if (!otherUser || !otherProfile) continue;

      const [lastMessage] = await db.select().from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const unreadMessages = await db.select().from(messages)
        .where(and(
          eq(messages.conversationId, conv.id),
          ne(messages.senderId, userId),
          eq(messages.isRead, false)
        ));

      result.push({
        conversation: conv,
        otherUser: { id: otherUserId, profile: otherProfile, isOnline: otherUser.isOnline },
        lastMessage: lastMessage ?? null,
        unreadCount: unreadMessages.length,
      });
    }

    return result;
  }

  async createConversation(participantOneId: string, participantTwoId: string): Promise<Conversation> {
    // Check if conversation already exists
    const existing = await this.getConversationBetweenUsers(participantOneId, participantTwoId);
    if (existing) return existing;

    const [newConversation] = await db.insert(conversations).values({
      participantOneId,
      participantTwoId,
    }).returning();
    return newConversation;
  }

  // Messages
  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update conversation's lastMessageAt
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));

    return newMessage;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(and(
        eq(messages.conversationId, conversationId),
        ne(messages.senderId, userId),
        eq(messages.isRead, false)
      ));
  }

  // Blocking
  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    const existing = await db.select().from(blockedUsers)
      .where(and(eq(blockedUsers.blockerId, blockerId), eq(blockedUsers.blockedId, blockedId)));
    
    if (existing.length === 0) {
      await db.insert(blockedUsers).values({ blockerId, blockedId });
    }
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    await db.delete(blockedUsers)
      .where(and(eq(blockedUsers.blockerId, blockerId), eq(blockedUsers.blockedId, blockedId)));
  }

  async isBlocked(userOneId: string, userTwoId: string): Promise<boolean> {
    const blocked = await db.select().from(blockedUsers)
      .where(or(
        and(eq(blockedUsers.blockerId, userOneId), eq(blockedUsers.blockedId, userTwoId)),
        and(eq(blockedUsers.blockerId, userTwoId), eq(blockedUsers.blockedId, userOneId))
      ));
    return blocked.length > 0;
  }

  async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
    return db.select().from(blockedUsers).where(eq(blockedUsers.blockerId, userId));
  }

  // Albums
  async getAlbums(userId: string): Promise<Album[]> {
    return db.select().from(albums)
      .where(eq(albums.userId, userId))
      .orderBy(asc(albums.sortOrder));
  }

  async getAlbum(albumId: string): Promise<Album | undefined> {
    const [album] = await db.select().from(albums).where(eq(albums.id, albumId));
    return album;
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    const [newAlbum] = await db.insert(albums).values(album).returning();
    return newAlbum;
  }

  async updateAlbum(albumId: string, updates: Partial<InsertAlbum>): Promise<Album | undefined> {
    const [updated] = await db.update(albums)
      .set(updates)
      .where(eq(albums.id, albumId))
      .returning();
    return updated;
  }

  async deleteAlbum(albumId: string): Promise<void> {
    await db.delete(albums).where(eq(albums.id, albumId));
  }

  // Photos
  async getPhotos(userId: string, albumId?: string): Promise<Photo[]> {
    if (albumId) {
      return db.select().from(photos)
        .where(and(eq(photos.userId, userId), eq(photos.albumId, albumId)))
        .orderBy(asc(photos.sortOrder));
    }
    return db.select().from(photos)
      .where(eq(photos.userId, userId))
      .orderBy(asc(photos.sortOrder));
  }

  async getPhoto(photoId: string): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, photoId));
    return photo;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async updatePhoto(photoId: string, updates: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const [updated] = await db.update(photos)
      .set(updates)
      .where(eq(photos.id, photoId))
      .returning();
    return updated;
  }

  async deletePhoto(photoId: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, photoId));
  }

  async setPrimaryPhoto(userId: string, photoId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Ensure the photo exists and belongs to the user *within the transaction*
      const [existing] = await tx.select().from(photos)
        .where(and(eq(photos.id, photoId), eq(photos.userId, userId)));

      if (!existing) return;

      // Clear others first
      await tx.update(photos)
        .set({ isPrimary: false })
        .where(and(eq(photos.userId, userId), ne(photos.id, photoId)));

      // Set target as primary and capture it
      const [updated] = await tx.update(photos)
        .set({ isPrimary: true })
        .where(and(eq(photos.id, photoId), eq(photos.userId, userId)))
        .returning();

      if (!updated) return;

      // Keep profile in sync
      await tx.update(profiles)
        .set({ primaryPhotoUrl: updated.objectPath })
        .where(eq(profiles.userId, userId));
    });
  }
}

export const storage = new DatabaseStorage();
