import { Directory, File, Paths } from "expo-file-system";

import {
  GLYPHS,
  SPRITE_JSONS,
  SPRITE_PNGS,
  TILE_MODULE,
} from "@/assets/map_assets";
import { MapResources } from "@/types/MapResources";
import { copyAsset } from "@/utils/copyAsset";

export async function prepareLocalMapResources(
  isCancelled: () => boolean = () => false,
): Promise<MapResources | null> {
  const tilesDest = new File(Paths.document, "msu-marawi.pmtiles");
  await copyAsset(TILE_MODULE, tilesDest, isCancelled);

  const glyphsDir = new Directory(Paths.document, "glyphs");
  for (const { font, range, module } of GLYPHS) {
    const fontDir = new Directory(glyphsDir, font);
    fontDir.create({ intermediates: true, idempotent: true });
    await copyAsset(module, new File(fontDir, `${range}.pbf`), isCancelled);
  }

  const spriteDir = new Directory(Paths.document, "sprite");
  spriteDir.create({ intermediates: true, idempotent: true });
  for (const { name, content } of SPRITE_JSONS) {
    const dest = new File(spriteDir, name);
    if (!dest.exists) {
      dest.create();
      dest.write(content);
    }
  }
  for (const { name, module } of SPRITE_PNGS) {
    await copyAsset(module, new File(spriteDir, name), isCancelled);
  }

  if (isCancelled()) return null;

  return {
    tiles: `pmtiles://${tilesDest.uri}`,
    glyphs: `${glyphsDir.uri}/{fontstack}/{range}.pbf`,
    sprite: `${spriteDir.uri}/osm-liberty`,
  };
}
