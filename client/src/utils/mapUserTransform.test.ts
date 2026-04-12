import { describe, it, expect } from 'vitest';
import {
  formatDistance,
  transformNearbyUserToMapUser,
  transformNearbyUsers,
  type NearbyUser,
} from './mapUserTransform';

describe('formatDistance', () => {
  it('should format distances under 1000m as meters', () => {
    expect(formatDistance(0)).toBe('0m');
    expect(formatDistance(100)).toBe('100m');
    expect(formatDistance(500)).toBe('500m');
    expect(formatDistance(999)).toBe('999m');
  });

  it('should round meters to the nearest integer', () => {
    expect(formatDistance(123.4)).toBe('123m');
    expect(formatDistance(123.6)).toBe('124m');
  });

  it('should format distances at or above 1000m as kilometers', () => {
    expect(formatDistance(1000)).toBe('1.0km');
    expect(formatDistance(1500)).toBe('1.5km');
    expect(formatDistance(2345)).toBe('2.3km');
    expect(formatDistance(10000)).toBe('10.0km');
  });

  it('should format kilometers with one decimal place', () => {
    expect(formatDistance(1234)).toBe('1.2km');
    expect(formatDistance(5678)).toBe('5.7km');
  });
});

describe('transformNearbyUserToMapUser', () => {
  it('should transform a complete user object correctly', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user123',
      profile: {
        headline: 'John Doe, Software Engineer',
        age: 28,
        photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        bio: 'Love coding and hiking',
        tags: ['Tech', 'Outdoors', 'Coffee'],
      },
      distance: 500,
      isOnline: true,
      location: {
        longitude: -74.006,
        latitude: 40.7128,
      },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result).toEqual({
      id: 'user123',
      name: 'John Doe',
      age: 28,
      distance: '500m',
      image: 'https://example.com/photo1.jpg',
      bio: 'Love coding and hiking',
      tags: ['Tech', 'Outdoors', 'Coffee'],
      status: 'online',
      coordinates: {
        x: -74.006,
        y: 40.7128,
      },
    });
  });

  it('should use default name when headline is missing', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      profile: {},
      distance: 200,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 3);

    expect(result.name).toBe('User 4');
  });

  it('should extract name from headline with comma', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user789',
      profile: {
        headline: 'Jane Smith, Designer',
      },
      distance: 100,
      isOnline: true,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.name).toBe('Jane Smith');
  });

  it('should use full headline when no comma is present', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user789',
      profile: {
        headline: 'JaneSmith',
      },
      distance: 100,
      isOnline: true,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.name).toBe('JaneSmith');
  });

  it('should use default age when age is missing', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      profile: {},
      distance: 200,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.age).toBe(25);
  });

  it('should format distance correctly', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      distance: 1500,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.distance).toBe('1.5km');
  });

  it('should generate default image URL when no photos provided', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      profile: {},
      distance: 200,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.image).toBe('https://api.dicebear.com/7.x/avataaars/svg?seed=user456');
  });

  it('should use empty string for bio when missing', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      distance: 200,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.bio).toBe('');
  });

  it('should use empty array for tags when missing', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      distance: 200,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.tags).toEqual([]);
  });

  it('should set status to online when isOnline is true', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      distance: 200,
      isOnline: true,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.status).toBe('online');
  });

  it('should set status to offline when isOnline is false', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      distance: 200,
      isOnline: false,
      location: { longitude: 0, latitude: 0 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.status).toBe('offline');
  });

  it('should correctly map coordinates', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user456',
      distance: 200,
      isOnline: false,
      location: {
        longitude: -122.4194,
        latitude: 37.7749,
      },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 0);

    expect(result.coordinates).toEqual({
      x: -122.4194,
      y: 37.7749,
    });
  });

  it('should handle undefined profile object', () => {
    const nearbyUser: NearbyUser = {
      userId: 'user789',
      distance: 300,
      isOnline: true,
      location: { longitude: 1, latitude: 2 },
    };

    const result = transformNearbyUserToMapUser(nearbyUser, 5);

    expect(result).toEqual({
      id: 'user789',
      name: 'User 6',
      age: 25,
      distance: '300m',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user789',
      bio: '',
      tags: [],
      status: 'online',
      coordinates: { x: 1, y: 2 },
    });
  });
});

describe('transformNearbyUsers', () => {
  it('should transform an empty array', () => {
    const result = transformNearbyUsers([]);
    expect(result).toEqual([]);
  });

  it('should transform a single user', () => {
    const users: NearbyUser[] = [
      {
        userId: 'user1',
        profile: {
          headline: 'Alice, Engineer',
          age: 30,
        },
        distance: 100,
        isOnline: true,
        location: { longitude: 0, latitude: 0 },
      },
    ];

    const result = transformNearbyUsers(users);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('user1');
    expect(result[0].name).toBe('Alice');
  });

  it('should transform multiple users', () => {
    const users: NearbyUser[] = [
      {
        userId: 'user1',
        profile: { headline: 'Alice, Engineer' },
        distance: 100,
        isOnline: true,
        location: { longitude: 0, latitude: 0 },
      },
      {
        userId: 'user2',
        profile: { headline: 'Bob, Designer' },
        distance: 200,
        isOnline: false,
        location: { longitude: 1, latitude: 1 },
      },
      {
        userId: 'user3',
        profile: {},
        distance: 300,
        isOnline: true,
        location: { longitude: 2, latitude: 2 },
      },
    ];

    const result = transformNearbyUsers(users);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('user1');
    expect(result[0].name).toBe('Alice');
    expect(result[1].id).toBe('user2');
    expect(result[1].name).toBe('Bob');
    expect(result[2].id).toBe('user3');
    expect(result[2].name).toBe('User 3'); // Using index
  });

  it('should correctly apply index to each user transformation', () => {
    const users: NearbyUser[] = [
      {
        userId: 'user1',
        distance: 100,
        isOnline: true,
        location: { longitude: 0, latitude: 0 },
      },
      {
        userId: 'user2',
        distance: 200,
        isOnline: false,
        location: { longitude: 1, latitude: 1 },
      },
    ];

    const result = transformNearbyUsers(users);

    expect(result[0].name).toBe('User 1');
    expect(result[1].name).toBe('User 2');
  });

  it('should preserve order of users in array', () => {
    const users: NearbyUser[] = [
      {
        userId: 'user3',
        profile: { headline: 'Charlie' },
        distance: 300,
        isOnline: true,
        location: { longitude: 0, latitude: 0 },
      },
      {
        userId: 'user1',
        profile: { headline: 'Alice' },
        distance: 100,
        isOnline: false,
        location: { longitude: 1, latitude: 1 },
      },
      {
        userId: 'user2',
        profile: { headline: 'Bob' },
        distance: 200,
        isOnline: true,
        location: { longitude: 2, latitude: 2 },
      },
    ];

    const result = transformNearbyUsers(users);

    expect(result[0].name).toBe('Charlie');
    expect(result[1].name).toBe('Alice');
    expect(result[2].name).toBe('Bob');
  });
});
