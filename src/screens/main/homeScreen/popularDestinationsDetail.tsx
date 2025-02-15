import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { useTheme } from "../../../context/themeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CreateTripContext } from "../../../context/createTripContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import MapView, { Marker } from "react-native-maps";

const { height } = Dimensions.get("window");

// Interface for route parameters
type RouteParams = {
  destination: {
    name: string;
    description: string;
    image: number;
    bestTimeToVisit: string;
    geoCoordinates?: {
      latitude: number;
      longitude: number;
    };
  };
};

type PopularDestinationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PopularDestinations"
>;

const PopularDestinations: React.FC = () => {
  const { currentTheme } = useTheme();
  const route = useRoute();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const { destination } = route.params as RouteParams;
  const navigation = useNavigation<PopularDestinationsScreenNavigationProp>();

  // Configure navigation header
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      // Custom back button with white background
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Hero Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={destination.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View
        style={[
          styles.contentContainer,
          { backgroundColor: currentTheme.background },
        ]}
      >
        {/* Destination Title */}
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.destinationTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              {destination.name}
            </Text>
          </View>
        </View>

        {/* Best Time to Visit Card */}
        <View style={styles.tripMetaContainer}>
          <View
            style={[
              styles.tripMetaItem,
              { backgroundColor: `${currentTheme.alternate}10` },
            ]}
          >
            <View style={styles.tripMetaIconContainer}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={currentTheme.alternate}
              />
            </View>
            <View style={styles.tripMetaTextContainer}>
              <Text
                style={[
                  styles.tripMetaLabel,
                  { color: currentTheme.textSecondary },
                ]}
              >
                Best Time to Visit
              </Text>
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {destination.bestTimeToVisit}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View
          style={[
            styles.descriptionContainer,
            { backgroundColor: `${currentTheme.accentBackground}80` },
          ]}
        >
          <Text
            style={[
              styles.descriptionTitle,
              { color: currentTheme.textPrimary },
            ]}
          >
            About
          </Text>
          <Text
            style={[styles.description, { color: currentTheme.textPrimary }]}
          >
            {destination.description}
          </Text>
        </View>

        {/* Map Section (if coordinates available) */}
        {destination.geoCoordinates && (
          <View style={styles.mapSection}>
            <Text
              style={[
                styles.descriptionTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              Location
            </Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: destination.geoCoordinates.latitude,
                  longitude: destination.geoCoordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: destination.geoCoordinates.latitude,
                    longitude: destination.geoCoordinates.longitude,
                  }}
                  title={destination.name}
                />
              </MapView>
            </View>
          </View>
        )}

        {/* Start Planning Button */}
        <Pressable
          style={[
            styles.exploreButton,
            { backgroundColor: currentTheme.alternate },
          ]}
          onPress={() => {
            /* Handle explore press */
          }}
        >
          <Text style={styles.exploreButtonText}>Start Planning!</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: height * 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  destinationTitle: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    letterSpacing: 0.5,
  },
  tripMetaContainer: {
    marginBottom: 5,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  tripMetaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tripMetaTextContainer: {
    flex: 1,
  },
  tripMetaLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  tripMetaText: {
    fontSize: 16,
  },
  descriptionContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  exploreButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  mapSection: {
    marginBottom: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 12,
  },
  map: {
    flex: 1,
  },
});

export default PopularDestinations;
