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