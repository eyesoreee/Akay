import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import PathFinder from "geojson-path-finder";

import rawNetwork from "@/assets/map/msu-routing.json";
import { haversine } from "@/utils/distance";

type Pos = [number, number];

const network = rawNetwork as FeatureCollection;
const pathFinder = new PathFinder({
  ...network,
  features: network.features.filter(
    (f): f is Feature<LineString> => f.geometry.type === "LineString",
  ),
});

const vertices = Object.keys(pathFinder.graph.vertices).map(
  (k) => k.split(",").map(Number) as Pos,
);

const pt = (coordinates: Pos): Feature<Point> => ({
  type: "Feature",
  properties: {},
  geometry: { type: "Point", coordinates },
});

const nearestVertex = (p: Pos): Pos => {
  let [best, bestD] = [vertices[0], Infinity];
  for (const v of vertices) {
    const d = haversine(p[1], p[0], v[1], v[0]);
    if (d < bestD) [best, bestD] = [v, d];
  }
  return best;
};

const lead = (raw: Pos, snap: Pos): Pos[] =>
  haversine(raw[1], raw[0], snap[1], snap[0]) > 0.01 ? [raw] : [];

export function routeWalking(from: Pos, to: Pos) {
  const start = nearestVertex(from);
  const finish = nearestVertex(to);

  const result = pathFinder.findPath(pt(start), pt(finish));
  if (!result) return null;

  const coordinates = [
    ...lead(from, start),
    ...result.path.map(([lon, lat]): Pos => [lon, lat]),
    ...lead(to, finish),
  ];

  let distance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    distance += haversine(
      coordinates[i - 1][1],
      coordinates[i - 1][0],
      coordinates[i][1],
      coordinates[i][0],
    );
  }
  return { coordinates, distance, duration: distance / (5 / 3.6) };
}

export function formatDistance(meters: number): string {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return mins < 1 ? "<1 min" : `${mins} min`;
}
