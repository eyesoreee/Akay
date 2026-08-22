import { Camera, CameraRef, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, View } from "react-native";

import customStyle from "@/assets/map/msu_marawi.json";
import CustomSearchBar from "@/components/CustomSearchBar";
import SearchResults from "@/components/SearchResults";
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
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [detentIndex, setDetentIndex] = useState(0);
  const resources = useLocalMapResources();

  const sheet = useRef<TrueSheet>(null);
  const cameraRef = useRef<CameraRef>(null);

  const mapStyle = useMemo(
    () => (resources ? buildMapStyle(customStyle, resources) : null),
    [resources],
  );

  const filteredBuildings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return (
      buildings?.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q),
      ) ?? []
    );
  }, [buildings, searchQuery]);

  useEffect(() => {
    if (selectedBuilding) sheet.current?.present();
    else sheet.current?.dismiss();
  }, [selectedBuilding]);

  const handleDismiss = () => {
    setSelectedBuilding(null);
    setDetentIndex(0);
  };

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setSearchQuery("");
    setIsFocused(false);
    cameraRef.current?.flyTo({
      center: [building.longitude, building.latitude],
      zoom: 18,
      duration: 1000,
    });
  };

  return (
    <View className="flex-1">
      {mapStyle ? (
        <Map
          mapStyle={mapStyle}
          className="flex-1"
          onPress={() => {
            Keyboard.dismiss();
            setIsFocused(false);
          }}
        >
          <Camera
            ref={cameraRef}
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

      <View className="absolute left-0 right-0 top-14 px-4">
        <CustomSearchBar
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </View>

      <SearchResults
        buildings={filteredBuildings}
        query={searchQuery}
        onSelect={handleSelectBuilding}
      />

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
