import * as cheerio from 'cheerio';

export interface ScrapedPageData {
  url: string;
  title: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogSiteName?: string;
  headings: string[];
  paragraphs: string[];
  images: string[];
  jsonLdProducts: any[];
  priceMatches: string[];
  rawTextSample: string;
}

/**
 * Validates that a URL is a legitimate public web URL (preventing local/private network probing)
 */
export function validatePublicUrl(urlString: string): { valid: boolean; error?: string; url?: URL } {
  try {
    const parsed = new URL(urlString);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are supported.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    // Block localhost, 127.0.0.1, internal IP ranges (SSRF defense)
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return { valid: false, error: 'Private or local network URLs cannot be accessed.' };
    }

    return { valid: true, url: parsed };
  } catch (err: any) {
    return { valid: false, error: 'Invalid URL format.' };
  }
}

/**
 * Fetches and parses a public product page safely
 */
export async function scrapeProductPage(urlString: string): Promise<ScrapedPageData> {
  const validation = validatePublicUrl(urlString);
  if (!validation.valid || !validation.url) {
    throw new Error(validation.error || 'Invalid URL provided.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let html = '';
  try {
    const response = await fetch(urlString, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AI-Studio-AdGenerator/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to load page. HTTP status: ${response.status}`);
    }

    html = await response.text();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out while trying to reach the product URL.');
    }
    throw err;
  }

  // Load and sanitize HTML with Cheerio (No script execution)
  const $ = cheerio.load(html);

  // Remove scripts, styles, iframes, and svgs to prevent overhead
  $('script:not([type="application/ld+json"])').remove();
  $('style, noscript, iframe, svg, canvas').remove();

  // Extract meta tags
  const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
  const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');

  // Extract Schema.org JSON-LD
  const jsonLdProducts: any[] = [];
  $('script[type="application/ld+json"]').each((_, elem) => {
    try {
      const content = $(elem).html();
      if (content) {
        const parsed = JSON.parse(content);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (item['@type'] === 'Product' || (Array.isArray(item['@type']) && item['@type'].includes('Product'))) {
            jsonLdProducts.push(item);
          } else if (item['@graph'] && Array.isArray(item['@graph'])) {
            for (const sub of item['@graph']) {
              if (sub['@type'] === 'Product') {
                jsonLdProducts.push(sub);
              }
            }
          }
        }
      }
    } catch (e) {
      // Ignore invalid JSON-LD
    }
  });

  // Extract Headings
  const headings: string[] = [];
  $('h1, h2, h3').each((_, elem) => {
    const text = $(elem).text().replace(/\s+/g, ' ').trim();
    if (text.length > 3 && text.length < 120 && !headings.includes(text)) {
      headings.push(text);
    }
  });

  // Extract Paragraphs & List items
  const paragraphs: string[] = [];
  $('p, li').each((_, elem) => {
    const text = $(elem).text().replace(/\s+/g, ' ').trim();
    if (text.length > 25 && text.length < 300 && !paragraphs.includes(text)) {
      paragraphs.push(text);
    }
  });

  // Extract candidate product images
  const images: string[] = [];
  if (ogImage && ogImage.startsWith('http')) {
    images.push(ogImage);
  }

  $('img').each((_, elem) => {
    let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-original');
    if (src) {
      // Resolve relative URLs
      try {
        src = new URL(src, urlString).href;
        if (
          src.startsWith('http') &&
          !src.includes('avatar') &&
          !src.includes('icon') &&
          !src.includes('pixel') &&
          !src.includes('badge') &&
          !images.includes(src)
        ) {
          images.push(src);
        }
      } catch (e) {
        // ignore invalid image URL
      }
    }
  });

  // Price matches
  const priceRegex = /(?:[$€£¥]\s?[0-9]{1,4}(?:[.,][0-9]{2})?)|(?:[0-9]{1,4}(?:[.,][0-9]{2})?\s?(?:USD|EUR|GBP|CAD|AUD))/gi;
  const pageText = $('body').text().replace(/\s+/g, ' ');
  const priceMatches = Array.from(new Set(pageText.match(priceRegex) || [])).slice(0, 8);

  return {
    url: urlString,
    title,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    ogSiteName,
    headings: headings.slice(0, 15),
    paragraphs: paragraphs.slice(0, 20),
    images: images.slice(0, 12),
    jsonLdProducts,
    priceMatches,
    rawTextSample: pageText.substring(0, 3000)
  };
}
