/**
 * JSON2Video API Types & Schema Constraints
 * Only supported JSON2Video primitives and properties are allowed.
 * Image formats supported: PNG, JPEG, JPG, WEBP (no SVG).
 */

export interface JSON2VideoTextAnimation {
  type: 'fade-in' | 'slide-in' | 'zoom-in' | 'fade-out' | 'slide-out';
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface JSON2VideoVideoElement {
  type: 'video';
  src: string;
  duration?: number;
  start?: number;
  volume?: number;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  muted?: boolean;
}

export interface JSON2VideoTextElement {
  type: 'text';
  text: string;
  font_family?: string;
  font_size?: number;
  font_weight?: string | number;
  font_color?: string;
  background_color?: string;
  border_radius?: number;
  padding?: number;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  text_align?: 'left' | 'center' | 'right';
  start?: number;
  duration?: number;
  animations?: JSON2VideoTextAnimation[];
}

export interface JSON2VideoImageElement {
  type: 'image';
  src: string; // Must be PNG, JPEG, JPG, or WEBP
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  start?: number;
  duration?: number;
  border_radius?: number;
}

export interface JSON2VideoShapeElement {
  type: 'shape';
  shape: 'rect' | 'circle';
  width: number | string;
  height: number | string;
  background_color: string;
  border_radius?: number;
  x?: number | string;
  y?: number | string;
  start?: number;
  duration?: number;
}

export interface JSON2VideoAudioElement {
  type: 'audio';
  src: string;
  volume?: number;
  start?: number;
  duration?: number;
}

export type JSON2VideoElement =
  | JSON2VideoVideoElement
  | JSON2VideoTextElement
  | JSON2VideoImageElement
  | JSON2VideoShapeElement
  | JSON2VideoAudioElement;

export interface JSON2VideoScene {
  comment?: string;
  duration: number;
  "background-color"?: string;
  transition?: {
    style: 'fade' | 'wipe-left' | 'wipe-right' | 'circle' | 'dissolve';
    duration?: number;
  };
  elements: JSON2VideoElement[];
}

export interface JSON2VideoMoviePayload {
  resolution?: '1080p' | '720p' | '4k';
  width?: number;
  height?: number;
  fps?: number;
  quality?: 'high' | 'medium' | 'draft';
  scenes: JSON2VideoScene[];
  elements?: JSON2VideoAudioElement[];
}
