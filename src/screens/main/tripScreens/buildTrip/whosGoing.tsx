import { View, Text, StyleSheet, Animated, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { RootStackParamList } from "../../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { CreateTripContext } from "../../../../context/createTripContext";
import { useTheme } from "../../../../context/themeContext";
import Slider from "@react-native-community/slider";
import { MainButton } from "../../../../components/ui/button";
import { Ionicons } from "@expo/vector-icons";

type WhosGoingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WhosGoing"
>;

const WhosGoing: React.FC = () => {
  const navigation = useNavigation<WhosGoingNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [whoIsGoing, setWhoIsGoing] = useState<number>(1);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Initialize trip data with default solo traveler setting
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });

    const updatedTripData = {
      ...tripData,
      whoIsGoing: "Solo",
    };
    setTripData(updatedTripData);
  }, [navigation]);

  // Handle selection of number of travelers
  const handleWhoIsGoingChange = (value: number) => {
    setWhoIsGoing(value);

    // Determine text description based on number selected
    let whoIsGoingText = "Group";
    if (value === 1) {
      whoIsGoingText = "Solo";
    } else if (value === 2) {
      whoIsGoingText = "Couple";
    }

    // Update trip data with selection
    const updatedTripData = {
      ...tripData,
      whoIsGoing: whoIsGoingText,
    };
    setTripData(updatedTripData);

    // Animate the selection text
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getIconForSelection = () => {
    if (whoIsGoing === 1) return "person-outline";
    if (whoIsGoing === 2) return "people-outline";
    return "people-circle-outline";
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={[styles.subheading, { color: currentTheme.textSecondary }]}
          >
            With who?
          </Text>
          <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
            Choose how many people you're traveling with
          </Text>
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIconForSelection()}
              size={60}
              color={currentTheme.alternate}
            />
          </View>

          <Animated.Text
            style={[
              styles.selectionText,
              {
                color: currentTheme.textPrimary,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {whoIsGoing === 1 ? "Solo" : whoIsGoing === 2 ? "Couple" : "Group"}
          </Animated.Text>

          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={4}
            step={1}
            value={whoIsGoing}
            onValueChange={handleWhoIsGoingChange}
            minimumTrackTintColor={currentTheme.alternate}
            maximumTrackTintColor={currentTheme.accentBackground}
            thumbTintColor={currentTheme.alternate}
          />

          <View style={styles.markerContainer}>
            {[...Array(4)].map((_, index) => (
              <Text
                key={index}
                style={[
                  styles.markerText,
                  {
                    color:
                      whoIsGoing === index + 1
                        ? currentTheme.alternate
                        : currentTheme.textSecondary,
                    fontWeight: whoIsGoing === index + 1 ? "bold" : "normal",
                  },
                ]}
              >
                {index < 3 ? index + 1 : "4+"}
              </Text>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <MainButton
              onPress={() => {
                console.log("Updated Trip Data:", tripData);
                navigation.navigate("MoreInfo");
              }}
              buttonText="Continue"
              width={"70%"}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 32,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
    marginBottom: 16,
  },
  sliderContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 20,
  },
  markerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 0,
  },
  markerText: {
    fontSize: 16,
    textAlign: "center",
    width: `${100 / 4}%`,
  },
  selectionText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 100,
    width: "100%",
  },
});

export default WhosGoing;
