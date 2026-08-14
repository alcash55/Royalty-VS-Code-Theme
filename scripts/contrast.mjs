/**
 * WCAG 2.1 relative luminance and contrast ratio helpers.
 * No dependencies — this runs with plain `node`.
 */

/**
 * Parses #rgb, #rrggbb or #rrggbbaa into channel values 0-255 plus alpha 0-1.
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number, a: number }}
 */
export function parseHex(hex) {
  const value = hex.replace('#', '').trim();

  if (value.length === 3) {
    const [r, g, b] = [...value].map((c) => Number.parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }

  if (value.length === 6 || value.length === 8) {
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16),
      a: value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1,
    };
  }

  throw new Error(`Unparseable color: "${hex}"`);
}

/**
 * Composites a possibly-translucent color over an opaque backdrop, which is what
 * the eye actually sees and therefore what contrast must be measured against.
 * @param {string} foreground
 * @param {string} backdrop - must be opaque
 * @returns {string} opaque #rrggbb
 */
export function flatten(foreground, backdrop) {
  const fg = parseHex(foreground);

  if (fg.a === 1) {
    return `#${[fg.r, fg.g, fg.b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  }

  const bg = parseHex(backdrop);
  const mix = (f, b) => Math.round(f * fg.a + b * (1 - fg.a));

  return `#${[mix(fg.r, bg.r), mix(fg.g, bg.g), mix(fg.b, bg.b)]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * WCAG relative luminance.
 * @param {string} hex - opaque color
 * @returns {number}
 */
export function luminance(hex) {
  const { r, g, b } = parseHex(hex);

  const channel = (value) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Contrast ratio between two colors, compositing the foreground over the
 * background first so alpha is accounted for.
 * @param {string} foreground
 * @param {string} background - must be opaque
 * @returns {number} ratio between 1 and 21
 */
export function contrast(foreground, background) {
  const fg = luminance(flatten(foreground, background));
  const bg = luminance(background);
  const [lighter, darker] = fg > bg ? [fg, bg] : [bg, fg];

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * @param {number} ratio
 * @returns {'AAA'|'AA'|'AA Large'|'FAIL'}
 */
export function rating(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'FAIL';
}
