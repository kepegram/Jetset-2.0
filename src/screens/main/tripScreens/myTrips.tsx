import React, { useState, useCallback } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Pressable,
  Text,
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import StartNewTripCard from "../../../components/myTrips/startNewTripCard";
import CurrentTripsCard from "../../../components/myTrips/currentTripCard";
import UpcomingTripsCard from "../../../components/myTrips/upcomingTripsCard";
import PastTripListCard from "../../../components/myTrips/pastTripListCard";
import { useProfile } from "../../../context/profileContext";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SkeletonCard from "../../../components/common/SkeletonCard";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

type MyTripsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const MyTrips: React.FC = () => {
  const { currentTheme } = useTheme();
  const { displayName } = useProfile();
  const [userName, setUserName] = useState<string | null>(null);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<MyTripsScreenNavigationProp>();
  const ITEMS_TO_SHOW = 6;

  const user = FIREBASE_AUTH.currentUser;

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const user = getAuth().currentUser;
        if (user) {
          try {
            const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserName(data?.name || "");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };

      fetchUserData();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (user) GetMyTrips();
    }, [user])
  );

  const GetMyTrips = async () => {
    try {
      setLoading(true);
      setUserTrips([]);

      if (!user) return;

      const tripsQuery = query(
        collection(FIREBASE_DB, `users/${user.uid}/userTrips`)
      );

      const querySnapshot = await getDocs(tripsQuery);
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPastTrips = () => {
    return userTrips
      .filter((trip) => moment(trip.tripData.endDate).isBefore(moment(), "day"))
      .sort((a, b) => {
        const dateA = moment(a.tripData.endDate);
        const dateB = moment(b.tripData.endDate);
        return dateB.diff(dateA); // Most recent first
      })
      .slice(0, ITEMS_TO_SHOW);
  };

  const sortedUpcomingTrips = userTrips
    .filter((trip) => {
      const startDate = moment(trip.tripData.startDate).startOf("day");
      return startDate.isAfter(moment().startOf("day"));
    })
    .sort((a, b) => {
      const dateA = moment(a.tripData.startDate);
      const dateB = moment(b.tripData.startDate);
      return dateA.diff(dateB);
    })
    .slice(0, ITEMS_TO_SHOW);

  const totalUpcomingTrips = userTrips.filter((trip) => {
    const startDate = moment(trip.tripData.startDate).startOf("day");
    return startDate.isAfter(moment().startOf("day"));
  }).length;

  const totalPastTrips = userTrips.filter((trip) =>
    moment(trip.tripData.endDate).isBefore(moment(), "day")
  ).length;

  const hasCurrentTrip = userTrips.some((trip) => {
    const startDate = moment(trip.tripData.startDate).startOf("day");
    const endDate = moment(trip.tripData.endDate).endOf("day");
    const today = moment().startOf("day");
    return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
  });

  const getCurrentTrips = () => {
    return userTrips.filter((trip) => {
      const startDate = moment(trip.tripData.startDate).startOf("day");
      const endDate = moment(trip.tripData.endDate).endOf("day");
      const today = moment().startOf("day");
      return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
    });
  };

  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentTheme.background,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {userName ? (
            <Text
              style={[styles.headerTitle, { color: currentTheme.textPrimary }]}
            >
              {userName}'s Trips ✈️
            </Text>
          ) : (
            <Text
              style={[
                styles.smheaderTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              {displayName}'s Trips ✈️
            </Text>
          )}
          <Pressable
            style={styles.addButton}
            onPress={() => navigation.navigate("WhereTo")}
          >
            <Fontisto
              name="plus-a"
              size={24}
              color={currentTheme.icon}
              style={[
                styles.addButton,
                { backgroundColor: currentTheme.accentBackground },
              ]}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.tripsContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Current Trip
              </Text>
            </View>
            <SkeletonCard variant="current" />

            <View style={styles.sectionHeaderContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Upcoming Trips
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((_, index) => (
                <SkeletonCard key={index} variant="upcoming" />
              ))}
            </ScrollView>

            <View style={styles.sectionHeaderContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Past Trips
              </Text>
            </View>
            {[1, 2, 3].map((_, index) => (
              <SkeletonCard key={index} variant="past" />
            ))}
          </View>
        ) : (
          <>
            {userTrips.length === 0 ? (
              <StartNewTripCard navigation={navigation} />
            ) : (
              <View style={styles.tripsContainer}>
                <View style={styles.sectionHeaderContainer}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    Current Trip
                  </Text>
                </View>
                {hasCurrentTrip ? (
                  <CurrentTripsCard userTrips={userTrips} />
                ) : (
                  <Animated.View
                    style={[
                      styles.container,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <Pressable
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                      onPress={() => navigation.navigate("WhereTo")}
                      style={[styles.cardContainer]}
                    >
                      <Image
                        source={require("../../../assets/app-imgs/placeholder.jpeg")}
                        style={styles.noTripImage}
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.9)"]}
                        style={styles.gradient}
                      >
                        <View style={styles.contentContainer}>
                          <View style={styles.noTripContent}>
                            <MaterialIcons
                              name="flight"
                              size={32}
                              color="#fff"
                            />
                            <Text style={styles.noTripText}>
                              No current trips. Time to plan your next
                              adventure!
                            </Text>
                            <View style={styles.createTripButtonContainer}>
                              <View style={styles.createTripButton}>
                                <MaterialIcons
                                  name="add-circle"
                                  size={24}
                                  color="#000"
                                />
                                <Text style={styles.createTripText}>
                                  Start New Trip
                                </Text>
                              </View>
                              <Text style={styles.tapToStartText}>
                                Tap to begin planning
                              </Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                )}

                <View style={styles.sectionHeaderContainer}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    Upcoming Trips
                  </Text>
                  {totalUpcomingTrips >= 3 && (
                    <Pressable
                      style={styles.seeAllButton}
                      onPress={() => {
                        const upcomingTrips = userTrips.filter((trip) => {
                          const startDate = moment(
                            trip.tripData.startDate
                          ).startOf("day");
                          return startDate.isAfter(moment().startOf("day"));
                        });
                        if (upcomingTrips.length > 0) {
                          navigation.navigate("AllTripsView", {
                            trips: JSON.stringify(upcomingTrips),
                            type: "upcoming",
                          });
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.seeAllText,
                          { color: currentTheme.alternate },
                        ]}
                      >
                        See All
                      </Text>
                    </Pressable>
                  )}
                </View>
                {sortedUpcomingTrips.length > 0 ? (
                  <View>
                    <FlatList
                      data={sortedUpcomingTrips}
                      horizontal
                      renderItem={({ item }) => (
                        <View style={styles.upcomingTripCard}>
                          <UpcomingTripsCard userTrips={[item]} />
                        </View>
                      )}
                      keyExtractor={(item) => item.id}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.upcomingTripsContainer}
                      ListFooterComponent={() =>
                        totalUpcomingTrips > ITEMS_TO_SHOW ? (
                          <Pressable
                            style={styles.seeMoreButton}
                            onPress={() =>
                              console.log("See all upcoming trips")
                            }
                          >
                            <Text
                              style={[
                                styles.seeMoreText,
                                { color: currentTheme.alternate },
                              ]}
                            >
                              See All ({totalUpcomingTrips})
                            </Text>
                          </Pressable>
                        ) : null
                      }
                    />
                  </View>
                ) : (
                  <Pressable
                    style={styles.noUpcomingTripsContainer}
                    onPress={() => navigation.navigate("WhereTo")}
                  >
                    <MaterialCommunityIcons
                      name="calendar-plus"
                      size={24}
                      color={currentTheme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.noUpcomingTripsText,
                        { color: currentTheme.textSecondary },
                      ]}
                    >
                      No upcoming trips planned
                    </Text>
                    <Text
                      style={[
                        styles.addTripText,
                        { color: currentTheme.alternate },
                      ]}
                    >
                      Tap to plan a new adventure
                    </Text>
                  </Pressable>
                )}

                {totalPastTrips > 0 && (
                  <>
                    <View style={styles.sectionHeaderContainer}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: currentTheme.textPrimary },
                        ]}
                      >
                        Past Trips
                      </Text>
                      {totalPastTrips >= 3 && (
                        <Pressable
                          style={styles.seeAllButton}
                          onPress={() => {
                            const pastTrips = userTrips.filter((trip) =>
                              moment(trip.tripData.endDate).isBefore(
                                moment(),
                                "day"
                              )
                            );
                            if (pastTrips.length > 0) {
                              navigation.navigate("AllTripsView", {
                                trips: JSON.stringify(pastTrips),
                                type: "past",
                              });
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.seeAllText,
                              { color: currentTheme.alternate },
                            ]}
                          >
                            See All
                          </Text>
                        </Pressable>
                      )}
                    </View>
                    <View style={styles.pastTripsContainer}>
                      {getPastTrips().map((trip, index) => {
                        if (!trip || !trip.tripData || !trip.tripPlan) {
                          console.warn(
                            `Skipping invalid trip at index ${index}:`,
                            trip
                          );
                          return null;
                        }
                        return (
                          <PastTripListCard
                            trip={{
                              tripData: trip.tripData,
                              tripPlan: trip.tripPlan,
                              id: trip.id,
                            }}
                            key={index}
                          />
                        );
                      })}
                      {totalPastTrips > ITEMS_TO_SHOW && (
                        <Pressable
                          style={styles.seeMoreButton}
                          onPress={() => console.log("See all past trips")}
                        >
                          <Text
                            style={[
                              styles.seeMoreText,
                              { color: currentTheme.alternate },
                            ]}
                          >
                            See All ({totalPastTrips})
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
  },
  smheaderTitle: {
    fontSize: 23,
    fontWeight: "800",
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  tripsContainer: {
    flex: 1,
    gap: 20,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  seeAllButton: {
    padding: 8,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
  },
  upcomingTripCard: {
    marginRight: 15,
  },
  upcomingTripsContainer: {
    paddingVertical: 10,
  },
  pastTripsContainer: {
    gap: 15,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noTripImage: {
    width: "100%",
    height: 240,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
  },
  noTripContent: {
    alignItems: "center",
    gap: 12,
  },
  noTripText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  createTripButtonContainer: {
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  createTripButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createTripText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  tapToStartText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontStyle: "italic",
  },
  seeMoreButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  seeMoreText: {
    fontSize: 16,
    fontWeight: "600",
  },
  noUpcomingTripsContainer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  noUpcomingTripsText: {
    fontSize: 16,
    fontWeight: "500",
  },
  addTripText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MyTrips;
