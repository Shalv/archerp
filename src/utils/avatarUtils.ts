/**
 * Avatar & User Identity Utility
 * Handles image vs. initials detection, avatar image compression, and safe rendering
 */

export function isImageAvatar(avatar?: string | null): boolean {
  if (!avatar) return false;
  const str = String(avatar).trim();
  if (str.length < 5) return false;
  return (
    str.startsWith('data:image/') ||
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('blob:') ||
    str.startsWith('/') ||
    str.includes(';base64,')
  );
}

export function getUserInitials(name?: string, fallback = 'U'): string {
  if (!name) return fallback;
  const clean = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || fallback;
}

/**
 * Compresses and square-crops an uploaded user photo client-side using HTML5 Canvas.
 * Produces an optimized JPEG/WebP data URL of ~20-35KB, ensuring fast loads,
 * preventing localStorage quota overflows, and keeping database payloads compact.
 */
export function compressAvatarImage(file: File, maxSize = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Center-crop to square
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          const canvas = document.createElement('canvas');
          const targetSize = Math.min(maxSize, Math.max(minDim, 128));
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            targetSize,
            targetSize
          );

          // Prefer image/jpeg for broad compatibility and compact size
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (err) {
          // Fallback to original data URL if canvas manipulation fails
          resolve(readerEvent.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to decode the selected image file.'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsDataURL(file);
  });
}
