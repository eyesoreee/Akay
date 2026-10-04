import customStyle from "@/assets/map/msu_marawi.json";
import BuildingTypeFilter from "@/components/BuildingTypeFilter";
import CustomSearchBar from "@/components/CustomSearchBar";
import FollowUserButton from "@/components/FollowUserButton";
import { RouteChip } from "@/components/RouteChip";
import SearchResults from "@/components/SearchResults";
import SyncChip from "@/components/SyncChip";
import { colors } from "@/constants/color";
import { BOUNDS } from "@/constants/msu_bounds";
import { BuildingSheet } from "@/features/buildings/components/BuildingSheet";
import { LocationMarker } from "@/features/buildings/components/LocationMarker";
import { useBuildings } from "@/features/buildings/hooks/building.query";
import { Building } from "@/features/buildings/types/building.entity";
import { BuildingType } from "@/features/buildings/types/BuildingType";
import { useLocalMapResources } from "@/hooks/useLocalMapResources";
import { routeWalking } from "@/lib/walkRouting";
import { buildMapStyle } from "@/utils/buildMapStyle";
import { haversine } from "@/utils/distance";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
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
import { useStatus } from "@powersync/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, View } from "react-native";

export default function App() {
  const { data: buildings } = useBuildings();
  const syncStatus = useStatus();
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
  const [locationReady, setLocationReady] = useState(false);
  const userPosition = useCurrentPosition({ enabled: locationReady });
  const routeFrom = useMemo<[number, number] | null>(
    () =>
      showDirections && userPosition
        ? [userPosition.coords.longitude, userPosition.coords.latitude]
        : null,
    [showDirections, userPosition],
  );

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

  const routeKey =
    showDirections && routeFrom && selectedBuilding
      ? `${routeFrom[0]},${routeFrom[1]}|${selectedBuilding.id}`
      : null;

  const route = useMemo(
    () =>
      routeKey && routeFrom && selectedBuilding
        ? routeWalking(routeFrom, [
            selectedBuilding.longitude,
            selectedBuilding.latitude,
          ])
        : null,
    [routeKey, routeFrom, selectedBuilding],
  );

  const routeData = useMemo(() => {
    if (!showDirections || !selectedBuilding || !routeFrom) return null;
    const coordinates = route?.coordinates ?? [
      routeFrom,
      [selectedBuilding.longitude, selectedBuilding.latitude],
    ];
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates,
          },
        },
      ],
    };
  }, [showDirections, selectedBuilding, routeFrom, route]);

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

  const handleTypeChange = (nextType: BuildingType | null) => {
    setSelectedType(nextType);
    if (
      selectedBuilding &&
      nextType &&
      selectedBuilding.type.toLowerCase() !== nextType.toLowerCase()
    ) {
      setSelectedBuilding(null);
      setShowDirections(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!(await LocationManager.requestPermissions())) return;
      setLocationReady(true);
    })();
  }, []);

  return (
    <View className="flex-1">
      {mapStyle ? (
        <Map
          mapStyle={mapStyle}
          className="flex-1"
          compass
          compassPosition={{ top: 115, right: 20 }}
          onPress={() => {
            Keyboard.dismiss();
            setIsFocused(false);
            if (showDirections) setShowDirections(false);
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
            onTrackUserLocationChange={(e) =>
              setFollowUser(e.nativeEvent.trackUserLocation != null)
            }
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
              selected={building.id === selectedBuilding?.id}
              onPress={() => {
                const next =
                  building.id === selectedBuilding?.id ? null : building;
                setSelectedBuilding(next);
                if (next) sheet.current?.present();
              }}
            />
          ))}

          {locationReady && (
            <UserLocation animated onPress={handleLocateUser} />
          )}

          {routeData && (
            <GeoJSONSource data={routeData}>
              <Layer
                type="line"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": colors.semantic.accent,
                  "line-width": 3,
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

      <BuildingTypeFilter
        onAllPress={() => setSelectedType(null)}
        onTypePress={(type) =>
          handleTypeChange(selectedType === type ? null : type)
        }
        selectedType={selectedType}
      />

      <SearchResults
        buildings={filteredBuildings}
        query={searchQuery}
        onSelect={handleSelectBuilding}
      />

      {showDirections && route && !searchQuery && (
        <RouteChip duration={route.duration} distance={route.distance} />
      )}

      {__DEV__ && (
        <SyncChip status={syncStatus} buildingsCount={buildings?.length ?? 0} />
      )}

      {userPosition && (
        <FollowUserButton
          followUser={followUser}
          onPress={() => setFollowUser((prev) => !prev)}
        />
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
