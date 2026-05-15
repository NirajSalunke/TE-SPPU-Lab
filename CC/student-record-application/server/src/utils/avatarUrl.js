/**
 * Returns a DiceBear initials SVG URL for a given seed string.
 * No image upload, no third-party storage needed.
 */
export const avatarUrl = (seed = 'User') => {
  const encoded = encodeURIComponent(seed);
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encoded}&backgroundColor=random&fontSize=38&bold=true`;
};

export default avatarUrl;
