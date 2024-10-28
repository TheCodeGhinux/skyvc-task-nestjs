import * as path from 'path';

export const MAX_PROFILE_PICTURE_SIZE = 2 * 1024 * 1024;
export const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];
// export const BASE_URL = 'https://staging.apiskyvc-task-nestjs.git'
export const PROFILE_PHOTO_UPLOADS = path.join(__dirname, '..', 'uploads');
