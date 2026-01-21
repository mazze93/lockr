import type { Photo } from "@shared/schema";

export interface PrimaryPhotoUpdater {
  setPrimaryPhoto: () => Promise<Photo | undefined>;
  clearOtherPrimaryPhotos: () => Promise<void>;
  updateProfilePhotoUrl: (photo: Photo) => Promise<void>;
}

export async function applyPrimaryPhotoUpdate({
  setPrimaryPhoto,
  clearOtherPrimaryPhotos,
  updateProfilePhotoUrl,
}: PrimaryPhotoUpdater): Promise<void> {
  const photo = await setPrimaryPhoto();

  if (!photo) {
    return;
  }

  await clearOtherPrimaryPhotos();
  await updateProfilePhotoUrl(photo);
}
