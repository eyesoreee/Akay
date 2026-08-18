import type { LngLatBounds } from "@maplibre/maplibre-react-native";
import { Camera, Map } from "@maplibre/maplibre-react-native";
import { Asset } from "expo-asset";
import { File, Paths } from "expo-file-system";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import customStyle from "@/assets/map/msu_marawi.json";

const BOUNDS: LngLatBounds = [124.25, 7.99, 124.272, 8.006];

export default function App() {
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
    style.layers = style.layers.filter(
      (layer) => layer["source-layer"] !== "poi",
    );
    return JSON.stringify(style);
  }, [tileSourceUrl]);

  return (
    <View className="flex-1">
      {mapStyle ? (
        <Map mapStyle={mapStyle} className="flex-1">
          <Camera
            initialViewState={{
              bounds: BOUNDS,
              padding: { top: 24, right: 24, bottom: 24, left: 24 },
            }}
            maxBounds={BOUNDS}
            minZoom={13}
            maxZoom={17}
          />
        </Map>
      ) : null}
    </View>
  );
}
