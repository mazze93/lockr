import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { insertProfileSchema, insertLocationSchema, insertMessageSchema } from "@shared/schema";

// Session middleware types
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Auth middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ AUTH ROUTES ============

  // Sign up
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({ email, passwordHash });

      // Set session
      req.session.userId = user.id;

      return res.status(201).json({ 
        userId: user.id,
        message: "Account created successfully"
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Update online status
      await storage.updateUserOnlineStatus(user.id, true);

      // Set session
      req.session.userId = user.id;

      return res.json({ 
        userId: user.id,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (userId) {
        await storage.updateUserOnlineStatus(userId, false);
      }

      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const profile = await storage.getProfile(user.id);
      const location = await storage.getLocation(user.id);

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          isOnline: user.isOnline,
          lastSeenAt: user.lastSeenAt,
        },
        profile: profile ?? null,
        location: location ? {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          blurRadiusMeters: location.blurRadiusMeters,
          ghostModeEnabled: location.ghostModeEnabled,
        } : null,
        needsOnboarding: !profile,
      });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Failed to get user" });
    }
  });

  // ============ PROFILE ROUTES ============

  // Create or update profile
  app.post("/api/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const existingProfile = await storage.getProfile(userId);

      const profileData = insertProfileSchema.parse({
        ...req.body,
        userId,
      });

      let profile;
      if (existingProfile) {
        profile = await storage.updateProfile(userId, profileData);
      } else {
        profile = await storage.createProfile(profileData);
      }

      return res.json({ profile });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Profile error:", error);
      return res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Get profile by user ID
  app.get("/api/profile/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.session.userId!;

      // Check if blocked
      const blocked = await storage.isBlocked(currentUserId, userId);
      if (blocked) {
        return res.status(403).json({ message: "User not found" });
      }

      const profile = await storage.getProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const user = await storage.getUser(userId);

      return res.json({
        profile,
        isOnline: user?.isOnline ?? false,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // ============ LOCATION ROUTES ============

  // Update location
  app.post("/api/location", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      const locationData = insertLocationSchema.parse({
        ...req.body,
        userId,
      });

      const location = await storage.upsertLocation(locationData);

      return res.json({
        location: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          blurRadiusMeters: location.blurRadiusMeters,
          ghostModeEnabled: location.ghostModeEnabled,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      console.error("Location error:", error);
      return res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Get nearby users
  app.get("/api/users/nearby", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { latitude, longitude, radius = "5000" } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusMeters = parseInt(radius as string, 10);

      const nearbyUsers = await storage.getNearbyUsers(userId, lat, lng, radiusMeters);

      // Apply location blur to results
      const blurredUsers = nearbyUsers.map(user => {
        const blur = user.location.blurRadiusMeters;
        // Add random offset within blur radius
        const angle = Math.random() * 2 * Math.PI;
        const offset = Math.random() * blur;
        const latOffset = (offset / 111000) * Math.cos(angle); // degrees
        const lngOffset = (offset / (111000 * Math.cos(user.location.latitude * Math.PI / 180))) * Math.sin(angle);

        return {
          userId: user.userId,
          profile: user.profile,
          location: {
            latitude: user.location.latitude + latOffset,
            longitude: user.location.longitude + lngOffset,
          },
          isOnline: user.isOnline,
          distance: user.distance,
        };
      });

      return res.json({ users: blurredUsers });
    } catch (error) {
      console.error("Nearby users error:", error);
      return res.status(500).json({ message: "Failed to get nearby users" });
    }
  });

  // ============ CONVERSATION ROUTES ============

  // Get conversations
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const conversations = await storage.getConversationsForUser(userId);
      return res.json({ conversations });
    } catch (error) {
      console.error("Conversations error:", error);
      return res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  // Create or get conversation
  app.post("/api/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { otherUserId } = req.body;

      if (!otherUserId) {
        return res.status(400).json({ message: "Other user ID is required" });
      }

      // Check if blocked
      const blocked = await storage.isBlocked(userId, otherUserId);
      if (blocked) {
        return res.status(403).json({ message: "Cannot message this user" });
      }

      const conversation = await storage.createConversation(userId, otherUserId);
      return res.json({ conversation });
    } catch (error) {
      console.error("Create conversation error:", error);
      return res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // ============ MESSAGE ROUTES ============

  // Get messages for a conversation
  app.get("/api/conversations/:conversationId/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { conversationId } = req.params;
      const { limit = "50", offset = "0" } = req.query;

      // Verify user is part of conversation
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Mark messages as read
      await storage.markMessagesAsRead(conversationId, userId);

      const messages = await storage.getMessages(
        conversationId,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );

      return res.json({ messages: messages.reverse() });
    } catch (error) {
      console.error("Get messages error:", error);
      return res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Send message
  app.post("/api/conversations/:conversationId/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { conversationId } = req.params;
      const { content } = req.body;

      // Verify user is part of conversation
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if blocked
      const otherUserId = conversation.participantOneId === userId 
        ? conversation.participantTwoId 
        : conversation.participantOneId;

      const blocked = await storage.isBlocked(userId, otherUserId);
      if (blocked) {
        return res.status(403).json({ message: "Cannot message this user" });
      }

      const messageData = insertMessageSchema.parse({
        conversationId,
        senderId: userId,
        content,
      });

      const message = await storage.createMessage(messageData);
      return res.json({ message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message", errors: error.errors });
      }
      console.error("Send message error:", error);
      return res.status(500).json({ message: "Failed to send message" });
    }
  });

  // ============ BLOCKING ROUTES ============

  // Block user
  app.post("/api/users/:userId/block", requireAuth, async (req, res) => {
    try {
      const blockerId = req.session.userId!;
      const { userId: blockedId } = req.params;

      await storage.blockUser(blockerId, blockedId);
      return res.json({ message: "User blocked" });
    } catch (error) {
      console.error("Block error:", error);
      return res.status(500).json({ message: "Failed to block user" });
    }
  });

  // Unblock user
  app.delete("/api/users/:userId/block", requireAuth, async (req, res) => {
    try {
      const blockerId = req.session.userId!;
      const { userId: blockedId } = req.params;

      await storage.unblockUser(blockerId, blockedId);
      return res.json({ message: "User unblocked" });
    } catch (error) {
      console.error("Unblock error:", error);
      return res.status(500).json({ message: "Failed to unblock user" });
    }
  });

  // Get blocked users
  app.get("/api/blocked", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const blockedUsers = await storage.getBlockedUsers(userId);
      return res.json({ blockedUsers });
    } catch (error) {
      console.error("Get blocked error:", error);
      return res.status(500).json({ message: "Failed to get blocked users" });
    }
  });

  return httpServer;
}
