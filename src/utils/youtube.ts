/**
 * Convert YouTube watch URL to embed URL
 * @param url - YouTube watch URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
 * @returns Embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)
 */
export const convertToEmbedUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Handle different YouTube URL formats
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    return url; // Return original if conversion fails
  } catch {
    return url; // Return original if URL parsing fails
  }
};

/**
 * Get YouTube video thumbnail URL
 * @param url - YouTube URL
 * @returns Thumbnail URL
 */
export const getYouTubeThumbnail = (url: string): string => {
  try {
    const urlObj = new URL(url);
    let videoId = '';
    
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v') || '';
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop';
  } catch {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop';
  }
};