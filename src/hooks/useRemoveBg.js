import { useState, useCallback } from 'react';
import { removeBackground } from '../services/removeBg';

const MAX_FILE_SIZE_MB = 12;

export function useRemoveBg() {
  const [originalFile, setOriginalFile]     = useState(null);
  const [originalUrl, setOriginalUrl]       = useState(null);
  const [resultUrl, setResultUrl]           = useState(null);
  const [resultBlob, setResultBlob]         = useState(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError]                   = useState(null);
  const [toast, setToast]                   = useState(null); // { type, message }

  const showToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const validateFile = useCallback((file) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      throw new Error('Unsupported format. Please upload a JPG, PNG, or WEBP image.');
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB (yours: ${sizeMB.toFixed(1)}MB).`);
    }
  }, []);

  const handleFile = useCallback((file) => {
    try {
      validateFile(file);
      // Revoke previous URLs to prevent memory leaks
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      setResultUrl(null);
      setResultBlob(null);
      setError(null);
      setUploadProgress(0);

      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
    } catch (err) {
      showToast('error', err.message);
    }
  }, [originalUrl, resultUrl, showToast, validateFile]);

  const process = useCallback(async () => {
    if (!originalFile) return;
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const blob = await removeBackground(originalFile, setUploadProgress);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
      showToast('success', 'Background removed successfully!');
    } catch (err) {
      const msg = err?.response?.data?.errors?.[0]?.title
        || err.message
        || 'Something went wrong. Please try again.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }, [originalFile, showToast]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl)   URL.revokeObjectURL(resultUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setUploadProgress(0);
    setToast(null);
  }, [originalUrl, resultUrl]);

  return {
    originalFile,
    originalUrl,
    resultUrl,
    resultBlob,
    isLoading,
    uploadProgress,
    error,
    toast,
    handleFile,
    process,
    reset,
    dismissToast,
    showToast,
  };
}
