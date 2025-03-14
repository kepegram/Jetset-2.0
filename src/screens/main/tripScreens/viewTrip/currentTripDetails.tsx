import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { useTheme } from "../../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PlannedTrip from "../../../../components/tripDetails/plannedTrip";
import moment from "moment";

const { height } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CurrentTripDetails"
>;

interface RouteParams {
  trip: string;
  photoRef: string;
}

const CurrentTripDetails: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { trip, photoRef } = route.params as RouteParams;

  const [tripDetails, setTripDetails] = React.useState<any>(null);
  const [daysLeft, setDaysLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
      ),
    });

    try {
      const parsedTrip = JSON.parse(trip);
      setTripDetails(parsedTrip);

      const endDate = moment(parsedTrip.endDate);
      const today = moment().startOf("day");
      const daysRemaining = endDate.diff(today, "days");
      setDaysLeft(daysRemaining);
    } catch (error) {
      console.error("Error parsing trip details:", error);
    }
  }, [trip, navigation]);

  if (!tripDetails) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <Ionicons name="airplane" size={50} color={currentTheme.alternate} />
        <Text style={[styles.loadingText, { color: currentTheme.textPrimary }]}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  // Ensure travelPlan exists with default values
  const travelPlanWithDefaults = {
    itinerary: tripDetails?.travelPlan?.itinerary || [],
    budget: tripDetails?.travelPlan?.budget || "Not specified",
    destination: tripDetails?.travelPlan?.destination || "Unknown Location",
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: photoRef
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${
                    // @ts-ignore
                    process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
                  }`
                : "https://via.placeholder.com/800",
            }}
            style={styles.image}
          />
        </View>
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.destinationTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {tripDetails?.travelPlan?.destination || "Unknown Location"}
              </Text>
            </View>
          </View>

          <View style={styles.tripMetaContainer}>
            <View
              style={[
                styles.tripMetaItem,
                { backgroundColor: currentTheme.alternateLight20 },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={currentTheme.alternate}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {daysLeft !== null
                  ? daysLeft === 0
                    ? "Last day!"
                    : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
                  : "End date not available"}
              </Text>
            </View>
            <View
              style={[
                styles.tripMetaItem,
                { backgroundColor: currentTheme.alternateLight20 },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={22}
                color={currentTheme.alternate}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {tripDetails?.whoIsGoing || "Unknown"}
              </Text>
            </View>
          </View>

          <PlannedTrip details={travelPlanWithDefaults} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loadingText: {
    fontFamily: "outfit-medium",
    fontSize: 18,
  },
  imageContainer: {
    height: height * 0.5,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
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
    flexDirection: "row",
    marginBottom: 25,
    gap: 15,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tripMetaText: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    marginLeft: 8,
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
});

export default CurrentTripDetails;
