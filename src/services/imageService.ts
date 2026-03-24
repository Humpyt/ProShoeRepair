const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const uploadImage = async (file: File, folder: 'products' | 'categories'): Promise<string> => {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
    }

    // Convert file to base64 data URL for local storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const base64String = reader.result as string;

          // Validate base64 result size (can be 33% larger than original)
          const approxSize = Math.ceil(base64String.length * 0.75);
          if (approxSize > MAX_FILE_SIZE) {
            reject(new Error(`Encoded file size would exceed ${MAX_FILE_SIZE / 1024 / 1024}MB limit`));
            return;
          }

          resolve(base64String);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
