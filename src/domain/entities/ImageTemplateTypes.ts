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
}
