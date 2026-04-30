import { test } from "node:test";
import assert from "node:assert/strict";
import type { Photo } from "@shared/schema";
import { applyPrimaryPhotoUpdate } from "../primary-photo";

test(
  "applyPrimaryPhotoUpdate skips clearing and profile update when setPrimaryPhoto returns undefined",
  async () => {
    let cleared = false;
    let updatedProfile = false;

    await applyPrimaryPhotoUpdate({
      setPrimaryPhoto: async () => undefined,
      clearOtherPrimaryPhotos: async () => {
        cleared = true;
      },
      updateProfilePhotoUrl: async () => {
        updatedProfile = true;
      },
    });

    assert.equal(cleared, false);
    assert.equal(updatedProfile, false);
  },
);

test("applyPrimaryPhotoUpdate clears others and updates profile when photo exists", async () => {
  const photo: Photo = {
    id: "photo-1",
    userId: "user-1",
    albumId: null,
    objectPath: "/photos/primary.png",
    caption: null,
    isPrimary: true,
    sortOrder: 0,
    createdAt: new Date(),
  };

  let cleared = false;
  let updatedProfile = false;

  await applyPrimaryPhotoUpdate({
    setPrimaryPhoto: async () => photo,
    clearOtherPrimaryPhotos: async () => {
      cleared = true;
    },
    updateProfilePhotoUrl: async (updatedPhoto) => {
      updatedProfile = updatedPhoto.objectPath === "/photos/primary.png";
    },
  });

  assert.equal(cleared, true);
  assert.equal(updatedProfile, true);
});

test("applyPrimaryPhotoUpdate propagates errors from clearOtherPrimaryPhotos", async () => {
  const photo: Photo = {
    id: "photo-1",
    userId: "user-1",
    albumId: null,
    objectPath: "/photos/primary.png",
    caption: null,
    isPrimary: true,
    sortOrder: 0,
    createdAt: new Date(),
  };

  const expectedError = new Error("Failed to clear other primary photos");

  await assert.rejects(
    async () => {
      await applyPrimaryPhotoUpdate({
        setPrimaryPhoto: async () => photo,
        clearOtherPrimaryPhotos: async () => {
          throw expectedError;
        },
        updateProfilePhotoUrl: async () => {
          // Should not be called
        },
      });
    },
    (error: Error) => {
      assert.equal(error.message, expectedError.message);
      return true;
    },
  );
});

test("applyPrimaryPhotoUpdate propagates errors from updateProfilePhotoUrl", async () => {
  const photo: Photo = {
    id: "photo-1",
    userId: "user-1",
    albumId: null,
    objectPath: "/photos/primary.png",
    caption: null,
    isPrimary: true,
    sortOrder: 0,
    createdAt: new Date(),
  };

  const expectedError = new Error("Failed to update profile photo URL");
  let cleared = false;

  await assert.rejects(
    async () => {
      await applyPrimaryPhotoUpdate({
        setPrimaryPhoto: async () => photo,
        clearOtherPrimaryPhotos: async () => {
          cleared = true;
        },
        updateProfilePhotoUrl: async () => {
          throw expectedError;
        },
      });
    },
    (error: Error) => {
      assert.equal(error.message, expectedError.message);
      return true;
    },
  );

  // Verify that clearOtherPrimaryPhotos was called before the error
  assert.equal(cleared, true);
});
