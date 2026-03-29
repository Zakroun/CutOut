import axios from 'axios';

const API_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY;
const API_URL = import.meta.env.VITE_REMOVE_BG_URL;

/**
 * Remove background from an image file.
 * @param {File} imageFile
 * @param {Function} onProgress - optional progress callback (0–100)
 * @returns {Promise<Blob>} - PNG blob with background removed
 */
export async function removeBackground(imageFile, onProgress) {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('Please set your remove.bg API key in the .env file (VITE_REMOVE_BG_API_KEY).');
  }

  const formData = new FormData();
  formData.append('image_file', imageFile);
  formData.append('size', 'auto');

  const response = await axios.post(API_URL, formData, {
    headers: {
      'X-Api-Key': API_KEY,
    },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(percent);
      }
    },
  });

  if (response.status !== 200) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.data; // Blob
}
