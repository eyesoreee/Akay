import {
  Camera,
  CameraRef,
  LocationManager,
  Map,
  UserLocation,
  useCurrentPosition,
} from "@maplibre/maplibre-react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, View } from "react-native";

import customStyle from "@/assets/map/msu_marawi.json";
import CustomSearchBar from "@/components/CustomSearchBar";
import SearchResults from "@/components/SearchResults";
import { colors } from "@/constants/color";
import { BOUNDS } from "@/constants/msu_bounds";
import { BuildingSheet } from "@/features/buildings/components/BuildingSheet";
import { LocationMarker } from "@/features/buildings/components/LocationMarker";
import { useBuildings } from "@/features/buildings/hooks/building.query";
import { Building } from "@/features/buildings/types/building.entity";
import { BuildingType } from "@/features/buildings/types/BuildingType";
import { useLocalMapResources } from "@/hooks/useLocalMapResources";
import { buildMapStyle } from "@/utils/buildMapStyle";
import { haversine } from "@/utils/distance";
import { TrueSheet } from "@lodev09/react-native-true-sheet";

const BUILDING_TYPES = Object.values(BuildingType);

export default function App() {
  const { data: buildings } = useBuildings();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState<BuildingType | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [detentIndex, setDetentIndex] = useState(0);
  const [followUser, setFollowUser] = useState(false);
  const resources = useLocalMapResources();
  const userPosition = useCurrentPosition();

  const sheet = useRef<TrueSheet>(null);
  const cameraRef = useRef<CameraRef>(null);

  const mapStyle = useMemo(
    () => (resources ? buildMapStyle(customStyle, resources) : null),
    [resources],
  );

  const filteredBuildings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (
      buildings?.filter((b) => {
        const matchesType =
          !selectedType || b.type.toLowerCase() === selectedType.toLowerCase();
        const matchesSearch =
          !q ||
          b.name.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q);
        return matchesType && matchesSearch;
      }) ?? []
    );
  }, [buildings, searchQuery, selectedType]);

  const distanceToSelected = useMemo(() => {
    if (!selectedBuilding || !userPosition) return null;
    return haversine(
      userPosition.coords.latitude,
      userPosition.coords.longitude,
      selectedBuilding.latitude,
      selectedBuilding.longitude,
    );
  }, [selectedBuilding, userPosition]);

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

  const handleLocateUser = () => {
    if (!userPosition) return;
    cameraRef.current?.flyTo({
      center: [userPosition.coords.longitude, userPosition.coords.latitude],
      zoom: 18,
      duration: 1000,
    });
  };

  useEffect(() => {
    LocationManager.requestPermissions();
  }, []);

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
            trackUserLocation={followUser ? "default" : undefined}
          />

          {filteredBuildings.map((building) => (
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

          <UserLocation animated onPress={handleLocateUser} />
        </Map>
      ) : null}

      <View className="absolute left-0 right-0 top-14 px-4">
        <CustomSearchBar
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </View>

      <View className="absolute top-[118px] left-0 right-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedType(null)}
            className={`rounded-full px-4 py-2 ${
              selectedType === null
                ? "bg-semantic-primary"
                : "bg-white border border-neutral-200"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedType === null
                  ? "text-semantic-textOnPrimary"
                  : "text-semantic-textPrimary"
              }`}
            >
              all
            </Text>
          </Pressable>

          {BUILDING_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() =>
                setSelectedType(selectedType === type ? null : type)
              }
              className={`rounded-full px-4 py-2 ${
                selectedType === type
                  ? "bg-semantic-primary"
                  : "bg-white border border-neutral-200"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedType === type
                    ? "text-semantic-textOnPrimary"
                    : "text-semantic-textPrimary"
                }`}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <SearchResults
        buildings={filteredBuildings}
        query={searchQuery}
        onSelect={handleSelectBuilding}
      />

      <Pressable
        onPress={() => {
          setFollowUser((prev) => !prev);
          if (!followUser) handleLocateUser();
        }}
        className={`absolute bottom-8 right-5 h-12 w-12 items-center justify-center rounded-full shadow-md ${
          followUser ? "bg-semantic-primary" : "bg-white"
        }`}
      >
        <Ionicons
          name={followUser ? "locate" : "locate-outline"}
          size={22}
          color={followUser ? "#fff" : colors.semantic.textPrimary}
        />
      </Pressable>

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
          distance={distanceToSelected}
          expanded={detentIndex === 1}
          onExpand={() => sheet.current?.resize(1)}
        />
      </TrueSheet>
    </View>
  );
}
