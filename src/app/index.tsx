import {
  Camera,
  CameraRef,
  GeoJSONSource,
  Images,
  Layer,
  LocationManager,
  Map,
  UserLocation,
  useCurrentPosition,
} from "@maplibre/maplibre-react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [showDirections, setShowDirections] = useState(false);
  const resources = useLocalMapResources();
  const userPosition = useCurrentPosition();

  const sheet = useRef<TrueSheet>(null);
  const cameraRef = useRef<CameraRef>(null);
  const directionsDismiss = useRef(false);

  const mapStyle = useMemo(
    () => (resources ? buildMapStyle(customStyle, resources) : null),
    [resources],
  );

  const filteredBuildings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (
      buildings?.filter((b) => {
        const matchesType = !selectedType || b.type === selectedType;
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

  const routeData = useMemo(() => {
    if (!showDirections || !selectedBuilding || !userPosition) return null;
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: [
              [userPosition.coords.longitude, userPosition.coords.latitude],
              [selectedBuilding.longitude, selectedBuilding.latitude],
            ],
          },
        },
      ],
    };
  }, [showDirections, selectedBuilding, userPosition]);

  const handleDismiss = () => {
    if (!directionsDismiss.current) {
      setSelectedBuilding(null);
      setShowDirections(false);
    }
    directionsDismiss.current = false;
    setDetentIndex(0);
  };

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setSearchQuery("");
    setIsFocused(false);
    setShowDirections(false);
    sheet.current?.present();
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

  const handleDirections = () => {
    directionsDismiss.current = true;
    setShowDirections(true);
    sheet.current?.dismiss();
  };

  const selectedId = selectedBuilding?.id;
  const selectedBuildingRef = useRef(selectedBuilding);

  useEffect(() => {
    selectedBuildingRef.current = selectedBuilding;
  });

  const handleMarkerPress = useCallback((building: Building) => {
    const next = selectedBuildingRef.current?.id === building.id ? null : building;
    setSelectedBuilding(next);
    if (next) sheet.current?.present();
  }, []);

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (showDirections) setShowDirections(false);
  }, [showDirections]);

  useEffect(() => {
    LocationManager.requestPermissions();
  }, []);

  return (
    <View className="flex-1">
      {mapStyle ? (
        <Map mapStyle={mapStyle} className="flex-1" onPress={handleMapPress}>
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

          <Images
            images={{
              "custom-marker": require("@/assets/akay_location_marker.png"),
              "custom-marker-selected": require("@/assets/akay_location_marker_selected.png"),
            }}
          />

          {filteredBuildings.map((building) => (
            <LocationMarker
              key={building.id}
              id={building.id}
              coords={[building.longitude, building.latitude]}
              selected={building.id === selectedId}
              onPress={() => handleMarkerPress(building)}
            />
          ))}

          <UserLocation animated onPress={handleLocateUser} />

          {routeData && (
            <GeoJSONSource id="route-source" data={routeData}>
              <Layer
                id="route-layer"
                type="line"
                source="route-source"
                paint={{
                  "line-color": colors.semantic.accent,
                  "line-width": 3,
                  "line-dasharray": [2, 2],
                }}
              />
            </GeoJSONSource>
          )}
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

      {userPosition && (
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
      )}

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
          hasLocation={userPosition != null}
          onExpand={() => sheet.current?.resize(1)}
          onDirections={handleDirections}
        />
      </TrueSheet>
    </View>
  );
}
