import { MemeTemplateOptions } from '../../domain/entities/ImageTemplateTypes';

/**
 * ImageTemplateService
 * 
 * Provides utilities for generating image template URLs (e.g. Memegen.link)
 */
export class ImageTemplateService {
  /**
   * Generates a Memegen.link URL for a given template and texts
   * 
   * @param options Meme configuration (templateKey, topText, bottomText)
   * @returns Formatted memegen.link URL
   */
  static generateMemeUrl(options: MemeTemplateOptions): string {
    const { templateKey, topText = '', bottomText = '', style, width, height } = options;
    
    // Internal helper for memegen-specific encoding
    const encodeMemeText = (text: string) => {
      const sanitized = text.trim();
      if (!sanitized) return "_";
      
      return encodeURIComponent(
        sanitized
          .replace(/ /g, "_")
          .replace(/\?/g, "~q")
          .replace(/#/g, "~h")
          .replace(/\//g, "~s")
      );
    };

    const top = encodeMemeText(topText);
    const bottom = encodeMemeText(bottomText);

    let url = `https://api.memegen.link/images/${templateKey}/${top}/${bottom}.png`;
    
    const params: string[] = [];
    if (style) params.push(`style=${style}`);
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return url;
  }

  /**
   * Extracts template key from a memegen.link URL or filename
   */
  static extractTemplateKey(url: string): string {
    if (!url) return 'custom';
    
    // Example: https://api.memegen.link/images/distracted.png -> distracted
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1] || '';
    return lastPart.split('.')[0] || 'custom';
  }
}
