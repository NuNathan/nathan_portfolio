export function toPastelColor(hex: string, blendFactor = 0.7): string {
  // Ensure hex starts with "#"
  if (!hex.startsWith("#")) throw new Error("Hex color must start with '#'");

  // Remove '#' and parse the R, G, B components
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Blend with white using the blendFactor (0 = original, 1 = white)
  const pastelR = Math.round(r + (255 - r) * blendFactor);
  const pastelG = Math.round(g + (255 - g) * blendFactor);
  const pastelB = Math.round(b + (255 - b) * blendFactor);

  // Convert back to hex string
  return `#${((1 << 24) + (pastelR << 16) + (pastelG << 8) + pastelB)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

export function getComplementaryColor(hex: string, rotation = 70): string {
 // Convert hex to RGB
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Convert RGB to HSL
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0; // Initialize with default value
  let s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0; // achromatic
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
      default: h = 0; break; // This should never happen, but satisfies TypeScript
    }
    h *= 60;
  }

  // Rotate the hue
  h = (h + rotation) % 360;

  // Convert back to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r1, g1, b1;

  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}