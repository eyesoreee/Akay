import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import customStyle from "@/assets/map/msu_marawi.json";
import { colors } from "@/constants/color";
import { BOUNDS } from "@/constants/msu_bounds";
import { BuildingSheet } from "@/features/buildings/components/BuildingSheet";
import { LocationMarker } from "@/features/buildings/components/LocationMarker";
import { useBuildings } from "@/features/buildings/hooks/building.query";
import { Building } from "@/features/buildings/types/building.entity";
import { useLocalMapResources } from "@/hooks/useLocalMapResources";
import { buildMapStyle } from "@/utils/buildMapStyle";
import { TrueSheet } from "@lodev09/react-native-true-sheet";

export default function App() {
  const { data: buildings } = useBuildings();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const [detentIndex, setDetentIndex] = useState(0);
  const resources = useLocalMapResources();
  const sheet = useRef<TrueSheet>(null);

  const mapStyle = useMemo(
    () => (resources ? buildMapStyle(customStyle, resources) : null),
    [resources],
  );

  useEffect(() => {
    if (selectedBuilding) sheet.current?.present();
    else sheet.current?.dismiss();
  }, [selectedBuilding]);

  const handleDismiss = () => {
    setSelectedBuilding(null);
    setDetentIndex(0);
  };

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
              selected={building.id === selectedBuilding?.id}
              onPress={() =>
                setSelectedBuilding(
                  building.id === selectedBuilding?.id ? null : building,
                )
              }
            />
          ))}
        </Map>
      ) : null}

      <TrueSheet
        ref={sheet}
        dimmed
        detents={["auto", 0.5]}
        onDidDismiss={handleDismiss}
        onDetentChange={(e) => setDetentIndex(e.nativeEvent.index)}
        backgroundColor={colors.semantic.primary}
      >
        <BuildingSheet
          building={selectedBuilding}
          expanded={detentIndex === 1}
          onExpand={() => sheet.current?.resize(1)}
        />
      </TrueSheet>
    </View>
  );
}
