/**
 * Image Template Types
 */

export interface ImageTemplate {
  id: string;
  name: string;
  url: string;
}

export interface MemeTemplateOptions {
  templateKey: string;
  topText?: string;
  bottomText?: string;
  style?: string; // e.g. 'black' for black text, or custom style
  width?: number;
  height?: number;
}
