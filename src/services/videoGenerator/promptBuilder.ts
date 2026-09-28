import { ProductProfile } from '../../types/adProject';

export interface GeneratedPrompts {
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  duration: number;
  productSpecificConstraints: string[];
}

export const BASELINE_NEGATIVE_PROMPT = [
  'voiceover',
  'spoken dialogue',
  'text overlay',
  'subtitles',
  'captions',
  'watermarks',
  'distorted faces',
  'deformed faces',
  'distorted product',
  'deformed product',
  'incorrect product geometry',
  'altered packaging',
  'incorrect labels',
  'distorted logos',
  'altered logos',
  'incorrect text',
  'fake text',
  'misspelled text',
  'duplicate objects',
  'extra objects',
  'extra limbs',
  'deformed hands',
  'flickering',
  'visual artifacts',
  'low quality',
  'unstable geometry'
].join(', ');

/**
 * Builds dynamic product-specific negative constraints based on category & materials
 */
function buildProductSpecificConstraints(profile: ProductProfile): string[] {
  const constraints: string[] = [];
  const text = `${profile.product.name} ${profile.product.description || ''} ${profile.product.category || ''}`.toLowerCase();

  if (text.includes('bottle') || text.includes('cup') || text.includes('mug') || text.includes('flask')) {
    constraints.push('Do not change bottle proportions, cap shape, label position, label colors, or packaging geometry.');
    constraints.push('No distorted lid, no liquid leakage artifacts, maintain cylindrical symmetry.');
  } else if (text.includes('coffee') || text.includes('grinder') || text.includes('espresso')) {
    constraints.push('Preserve dial numbers, burr alignment, hopper silhouette, and brushed metallic finish.');
    constraints.push('No deformed grounds, no melting plastic, maintain solid industrial metal housing.');
  } else if (text.includes('headphone') || text.includes('audio') || text.includes('earphone')) {
    constraints.push('Keep earcups symmetrical, preserve headband curvature, retain physical buttons and acoustic mesh.');
    constraints.push('No warped headband, no deformed cables, preserve leather grain texture.');
  } else if (text.includes('lamp') || text.includes('light') || text.includes('lighting')) {
    constraints.push('Maintain clean circular or linear geometry, preserve diffused LED ring, no flickering bulb filaments.');
    constraints.push('Preserve base materials, wood grain, or anodized finish without warped planes.');
  } else {
    constraints.push('Preserve exact product silhouette, material finish, branding placement, and functional components.');
    constraints.push('Do not alter physical dimensions or invent unrelated accessories.');
  }

  return constraints;
}

/**
 * Programmatically constructs the complete Wan 3.0 prompt from the ProductProfile
 */
export function buildWanPrompt(
  profile: ProductProfile,
  format: '9:16' | '1:1' | '16:9' = '9:16',
  style: 'auto' | 'cinematic' | 'punchy' | 'minimal' = 'auto',
  targetDuration: number = 15
): GeneratedPrompts {
  const { product, brand, assets } = profile;

  // 1. Product identity
  const identity = `${product.name} (${product.category || 'High-end Consumer Product'})`;

  // 2. Product appearance & materials
  const appearanceInfo = brand.visualStyle 
    ? `${brand.visualStyle}`
    : `Premium craftsmanship, sleek matte and metallic finishes, sophisticated edge details`;

  // 3. Physical characteristics & features
  const topFeatures = product.features.slice(0, 4).join(', ');

  // 4. Product benefits
  const topBenefits = product.benefits.slice(0, 3).join('. ');

  // 5. Brand identity
  const brandContext = brand.name ? `by ${brand.name}` : '';

  // 6. Commercial style
  let commercialStyle = 'Cinematic luxury commercial advertisement, Apple-caliber product showcase';
  if (style === 'punchy') {
    commercialStyle = 'High-energy fast-paced modern product reel, dynamic cuts, vibrant commercial polish';
  } else if (style === 'minimal') {
    commercialStyle = 'Minimalist Scandinavian architectural studio ad, tranquil ambient tones, pristine negative space';
  }

  // 7. Camera direction & motion
  const cameraDirection = 'Smooth controlled gimbal glide, macro 85mm lens rack focus, elegant 360-degree slow orbit around the hero product, rising vertical reveal';

  // 8. Lighting
  const lighting = 'Refined studio softbox lighting with amber and cool rim catchlights, subtle caustic reflections, volumetric depth';

  // 9. Scene/action & product interaction
  const sceneAction = `Show the hero ${product.name} in its ideal environment, operating flawlessly with seamless tactile motion, capturing real-world utility: ${topBenefits}`;

  // 10. Product consistency
  const referenceImageClause = assets.productImages.length > 0
    ? `The product must remain strictly visually identical to the reference image in shape, texture, color, and finish.`
    : `The product must maintain flawless geometric symmetry and consistent material texture throughout.`;

  // Assembling the complete prompt
  const promptLines = [
    `Create a premium commercial advertisement for:`,
    ``,
    `PRODUCT:`,
    `${identity} ${brandContext}`,
    ``,
    `DESCRIPTION:`,
    `${product.description || 'A flagship consumer product designed for peak performance and aesthetics.'}`,
    ``,
    `KEY FEATURES & ATTRIBUTES:`,
    `${topFeatures}`,
    ``,
    `PRODUCT APPEARANCE & MATERIALS:`,
    `${appearanceInfo}`,
    ``,
    `DESIRED COMMERCIAL DIRECTION:`,
    `- Style: ${commercialStyle}`,
    `- Camera: ${cameraDirection}`,
    `- Lighting: ${lighting}`,
    `- Motion & Action: ${sceneAction}`,
    `- Format: Vertical 9:16 mobile-first video reel, 60fps fluidity`,
    ``,
    `CONSISTENCY & BRAND INTEGRITY:`,
    `- ${referenceImageClause}`,
    `- Do not invent packaging or change the product identity.`,
    `- Photorealistic 8K render quality, physical materials, realistic weight, natural physics.`
  ];

  const productSpecificConstraints = buildProductSpecificConstraints(profile);
  const combinedNegative = `${BASELINE_NEGATIVE_PROMPT}, ${productSpecificConstraints.join(', ')}`;

  return {
    prompt: promptLines.join('\n'),
    negativePrompt: combinedNegative,
    aspectRatio: format,
    duration: targetDuration,
    productSpecificConstraints
  };
}
