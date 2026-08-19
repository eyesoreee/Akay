import type { LngLatBounds } from "@maplibre/maplibre-react-native";
import { Camera, Map } from "@maplibre/maplibre-react-native";
import { Asset } from "expo-asset";
import { File, Paths } from "expo-file-system";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import customStyle from "@/assets/map/msu_marawi.json";
import { LocationMarker } from "@/features/buildings/components/LocationMarker";
import { useBuildings } from "@/features/buildings/hooks/building.query";

const BOUNDS: LngLatBounds = [124.25, 7.99, 124.272, 8.006];

export default function App() {
  const { data: buildings } = useBuildings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tileSourceUrl, setTileSourceUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const dest = new File(Paths.document, "msu-marawi.pmtiles");
        if (!dest.exists) {
          const asset = Asset.fromModule(
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require("@/assets/map/msu-marawi.pmtiles"),
          );
          await asset.downloadAsync();
          if (cancelled || !asset.localUri) return;
          await new File(asset.localUri).copy(dest);
        }
        if (!cancelled) setTileSourceUrl(`pmtiles://${dest.uri}`);
      } catch (error) {
        console.error("Failed to prepare local tiles:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const mapStyle = useMemo(() => {
    if (!tileSourceUrl) return null;
    const style = JSON.parse(JSON.stringify(customStyle)) as {
      sources: Record<string, { url?: string }>;
      layers: { id: string; "source-layer"?: string }[];
    };
    style.sources.openmaptiles.url = tileSourceUrl;
    return JSON.stringify(style);
  }, [tileSourceUrl]);

  return (
    <View className="flex-1">
      {mapStyle ? (
        <Map mapStyle={mapStyle} className="flex-1">
          <Camera
            initialViewState={{
              center: [124.2583, 7.9997],
              zoom: 18,
            }}
            maxBounds={BOUNDS}
            minZoom={15}
            maxZoom={19}
          />

          {buildings?.map((building) => (
            <LocationMarker
              key={building.id}
              id={building.id}
              coords={[building.longitude, building.latitude]}
              selected={building.id === selectedId}
              onPress={() =>
                setSelectedId(building.id === selectedId ? null : building.id)
              }
            />
          ))}
        </Map>
      ) : null}
    </View>
  );
}
