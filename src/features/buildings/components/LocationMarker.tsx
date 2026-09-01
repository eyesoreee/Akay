import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";
import { memo, useMemo } from "react";

interface LocationMarkerProps {
  id: string;
  coords: [number, number];
  selected: boolean;
  onPress: () => void;
}

export const LocationMarker = memo(function LocationMarker({
  id,
  coords,
  selected,
  onPress,
}: LocationMarkerProps) {
  const data = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { selected },
          geometry: {
            type: "Point" as const,
            coordinates: coords,
          },
        },
      ],
    }),
    [coords, selected],
  );

  return (
    <GeoJSONSource
      id={`custom-marker-source-${id}`}
      data={data}
      onPress={onPress}
    >
      <Layer
        id={`custom-marker-layer-${id}`}
        type="symbol"
        source={`custom-marker-source-${id}`}
        layout={{
          "icon-image": [
            "case",
            ["get", "selected"],
            "custom-marker-selected",
            "custom-marker",
          ],
          "icon-anchor": "bottom",
          "icon-allow-overlap": true,
          "icon-size": ["case", ["get", "selected"], 0.45, 0.4],
        }}
      />
    </GeoJSONSource>
  );
});
