import type { Photo } from "@shared/schema";

/**
 * A collection of callback operations for updating a user's primary photo.
 * These operations are executed in a specific order by applyPrimaryPhotoUpdate.
 */
export interface PrimaryPhotoUpdateOperations {
  setPrimaryPhoto: () => Promise<Photo | undefined>;
  clearOtherPrimaryPhotos: () => Promise<void>;
  updateProfilePhotoUrl: (photo: Photo) => Promise<void>;
}

/**
 * Orchestrates the primary photo update flow with an early-exit guard.
 * 
 * @param operations - The database operations to execute for the primary photo update
 * 
 * **Behavior:**
 * - Calls setPrimaryPhoto first
 * - If setPrimaryPhoto returns undefined (no photo found/updated), exits early without side effects
 * - If a photo is returned, executes clearOtherPrimaryPhotos and updateProfilePhotoUrl in sequence
 * 
 * **Important notes:**
 * - Operations are NOT wrapped in a transaction by this function
 * - Any errors from the operations will propagate to the caller
 * - If clearOtherPrimaryPhotos or updateProfilePhotoUrl fails, the database may be left in an inconsistent state
 * - Callers should wrap this function in a transaction if atomicity is required
 */
export async function applyPrimaryPhotoUpdate({
  setPrimaryPhoto,
  clearOtherPrimaryPhotos,
  updateProfilePhotoUrl,
}: PrimaryPhotoUpdateOperations): Promise<void> {
  const photo = await setPrimaryPhoto();

  if (!photo) {
    return;
  }

  await clearOtherPrimaryPhotos();
  await updateProfilePhotoUrl(photo);
}
