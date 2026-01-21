import { test } from "node:test";
import assert from "node:assert/strict";
import type { Photo } from "@shared/schema";
import { applyPrimaryPhotoUpdate } from "../primary-photo";

test("applyPrimaryPhotoUpdate exits when no photo is found", async () => {
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
});

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
