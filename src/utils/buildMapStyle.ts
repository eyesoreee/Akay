import { MapResources } from "@/types/MapResources";

export function buildMapStyle(
  baseStyle: Record<string, any>,
  resources: MapResources,
): string {
  const style: Record<string, any> = {
    ...baseStyle,
    sources: { ...baseStyle.sources },
  };
  style.sources.openmaptiles = {
    ...style.sources.openmaptiles,
    url: resources.tiles,
  };
  style.glyphs = resources.glyphs;
  style.sprite = resources.sprite;
  return JSON.stringify(style);
}
