/* eslint-disable @typescript-eslint/no-require-imports */

export const TILE_MODULE = require("@/assets/map/msu-marawi.pmtiles");

export const GLYPHS: { font: string; range: string; module: number }[] = [
  {
    font: "Roboto Regular",
    range: "0-255",
    module: require("@/assets/map/glyphs/Roboto Regular/0-255.pbf"),
  },
  {
    font: "Roboto Regular",
    range: "256-511",
    module: require("@/assets/map/glyphs/Roboto Regular/256-511.pbf"),
  },
  {
    font: "Roboto Medium",
    range: "0-255",
    module: require("@/assets/map/glyphs/Roboto Medium/0-255.pbf"),
  },
  {
    font: "Roboto Medium",
    range: "256-511",
    module: require("@/assets/map/glyphs/Roboto Medium/256-511.pbf"),
  },
  {
    font: "Roboto Condensed Italic",
    range: "0-255",
    module: require("@/assets/map/glyphs/Roboto Condensed Italic/0-255.pbf"),
  },
  {
    font: "Roboto Condensed Italic",
    range: "256-511",
    module: require("@/assets/map/glyphs/Roboto Condensed Italic/256-511.pbf"),
  },
];

export const SPRITE_JSONS: { name: string; content: string }[] = [
  {
    name: "osm-liberty.json",
    content: JSON.stringify(require("@/assets/map/sprite/osm-liberty.json")),
  },
  {
    name: "osm-liberty@2x.json",
    content: JSON.stringify(require("@/assets/map/sprite/osm-liberty-2x.json")),
  },
];

export const SPRITE_PNGS: { name: string; module: number }[] = [
  {
    name: "osm-liberty.png",
    module: require("@/assets/map/sprite/osm-liberty.png"),
  },
  {
    name: "osm-liberty@2x.png",
    module: require("@/assets/map/sprite/osm-liberty-2x.png"),
  },
];
