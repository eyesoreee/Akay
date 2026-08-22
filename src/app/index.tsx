import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useMemo, useState } from "react";
import { View } from "react-native";

import customStyle from "@/assets/map/msu_marawi.json";
import { BOUNDS } from "@/constants/msu_bounds";
import { LocationMarker } from "@/features/buildings/components/LocationMarker";
import { useBuildings } from "@/features/buildings/hooks/building.query";
import { useLocalMapResources } from "@/hooks/useLocalMapResources";
import { buildMapStyle } from "@/utils/buildMapStyle";

export default function App() {
  const { data: buildings } = useBuildings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const resources = useLocalMapResources();

  const mapStyle = useMemo(
    () => (resources ? buildMapStyle(customStyle, resources) : null),
    [resources],
  );

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
