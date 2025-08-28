/**
 * Utility functions for handling product images
 */

/**
 * Safely extracts and returns a valid image URL from various formats
 * @param imageUrl - The image URL field from the database (can be string, JSON array, null)
 * @returns A valid image URL or fallback to placeholder
 */
export const getProductImageUrl = (imageUrl: string | null): string => {
  // Return placeholder if no image URL provided
  if (!imageUrl || imageUrl.trim() === '') {
    return "/placeholder.svg";
  }

  try {
    // Try to parse as JSON in case it's an array of URLs
    const parsed = JSON.parse(imageUrl);
    
    if (Array.isArray(parsed)) {
      // If it's an array, return the first valid URL
      const firstUrl = parsed.find(url => url && typeof url === 'string' && url.trim() !== '');
      return firstUrl || "/placeholder.svg";
    }
    
    // If parsed successfully but not an array, treat as single URL
    if (typeof parsed === 'string' && parsed.trim() !== '') {
      return parsed.trim();
    }
    
    return "/placeholder.svg";
  } catch {
    // If JSON parsing fails, treat as direct URL string
    if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      return imageUrl.trim();
    }
    
    return "/placeholder.svg";
  }
};

/**
 * Gets multiple image URLs from a JSON array or single URL
 * @param imageUrl - The image URL field from the database
 * @returns Array of valid image URLs
 */
export const getProductImageUrls = (imageUrl: string | null): string[] => {
  if (!imageUrl || imageUrl.trim() === '') {
    return ["/placeholder.svg"];
  }

  try {
    const parsed = JSON.parse(imageUrl);
    
    if (Array.isArray(parsed)) {
      const validUrls = parsed.filter(url => 
        url && typeof url === 'string' && url.trim() !== ''
      ).map(url => url.trim());
      
      return validUrls.length > 0 ? validUrls : ["/placeholder.svg"];
    }
    
    if (typeof parsed === 'string' && parsed.trim() !== '') {
      return [parsed.trim()];
    }
    
    return ["/placeholder.svg"];
  } catch {
    if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      return [imageUrl.trim()];
    }
    
    return ["/placeholder.svg"];
  }
};

/**
 * Creates a proper image component with error handling
 * @param src - Image source URL
 * @param alt - Alt text for the image
 * @param className - CSS classes
 * @param onError - Optional error handler
 */
export const createImageProps = (
  src: string | null,
  alt: string,
  className?: string,
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
) => {
  const imageSrc = getProductImageUrl(src);
  
  return {
    src: imageSrc,
    alt,
    className,
    onError: onError || ((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      if (target.src !== "/placeholder.svg") {
        target.src = "/placeholder.svg";
      }
    }),
    onLoad: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Ensure image loaded successfully
      const target = e.currentTarget;
      if (target.naturalWidth === 0 && target.src !== "/placeholder.svg") {
        target.src = "/placeholder.svg";
      }
    }
  };
};