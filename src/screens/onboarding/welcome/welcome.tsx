import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { MainButton } from "../../../components/ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { lightTheme } from "../../../theme/theme";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const Welcome: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);

  const facts = [
    {
      title: "AI-Powered Travel Planning 🤖",
      description: "Personalized travel plans created just for you",
      image: require("../../../assets/popular-imgs/paris.jpg"),
      location: "Paris",
    },
    {
      title: "Interactive Trip Planning 🗺️",
      description: "Visualize your journey with interactive maps",
      image: require("../../../assets/popular-imgs/dubai.jpg"),
      location: "Dubai",
    },
    {
      title: "Smart Itineraries 📱",
      description: "Day-by-day plans with local insights",
      image: require("../../../assets/popular-imgs/tokyo.jpeg"),
      location: "Tokyo",
    },
    {
      title: "Always Available 🌐",
      description: "Access your trips even offline",
      image: require("../../../assets/popular-imgs/sydney.jpg"),
      location: "Sydney",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % facts.length);
    }, 3000); // Change fact every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTermsPress = () => {
    console.log("Terms & Conditions pressed");
  };

  const handlePrivacyPress = () => {
    console.log("Privacy Policy pressed");
  };

  return (
    <View
      style={[
        styles.backgroundImage,
        { backgroundColor: lightTheme.background },
      ]}
    >
      <View style={styles.slide}>
        <View style={styles.topSection}>
          <View style={styles.carouselContainer}>
            <Animated.View
              key={activeIndex}
              entering={FadeIn.duration(800)}
              exiting={FadeOut.duration(800)}
              style={styles.factContainer}
            >
              <ImageBackground
                source={facts[activeIndex].image}
                style={styles.factImage}
                imageStyle={styles.factImageStyle}
              >
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>
                    {facts[activeIndex].location}
                  </Text>
                </View>
              </ImageBackground>
              <View style={styles.factContent}>
                <Text style={styles.factTitle}>{facts[activeIndex].title}</Text>
                <Text style={styles.factDescription}>
                  {facts[activeIndex].description}
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.middleSection}>
          <Image
            source={require("../../../assets/icons/adaptive-icon.png")}
            style={styles.logo}
          />
          <Animated.Text
            entering={FadeIn.delay(500).duration(1000)}
            style={styles.appName}
          >
            Jetset
          </Animated.Text>

          <Animated.Text
            entering={FadeIn.delay(1000).duration(1000)}
            style={styles.slogan}
          >
            Dream. Discover. <Text style={styles.exploreText}>Explore.</Text>
          </Animated.Text>
        </View>

        <View style={styles.bottomSection}>
          <Animated.View
            entering={FadeIn.delay(1500).duration(1000)}
            style={styles.buttonContainer}
          >
            <MainButton
              onPress={() => navigation.navigate("SignUp")}
              buttonText="Sign Up"
              style={styles.signUpButton}
              textColor="white"
            />
            <MainButton
              onPress={() => navigation.navigate("Login")}
              buttonText="Login"
              style={styles.altButton}
              textColor="black"
            />
          </Animated.View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              I have read and accepted Jetset's{" "}
            </Text>
            <View style={styles.termsRow}>
              <Pressable onPress={handleTermsPress}>
                <Text style={[styles.termsText, styles.termsLink]}>
                  Terms & Conditions
                </Text>
              </Pressable>
              <Text style={styles.termsText}>and </Text>
              <Pressable onPress={handlePrivacyPress}>
                <Text style={[styles.termsText, styles.termsLink]}>
                  Privacy Policy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  slide: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  middleSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  bottomSection: {
    width: "100%",
    paddingBottom: 10,
    gap: 8,
  },
  appName: {
    fontSize: 72,
    fontWeight: "bold",
    color: lightTheme.alternate,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 18,
    textAlign: "center",
    color: lightTheme.textSecondary,
    paddingHorizontal: 20,
  },
  exploreText: {
    color: lightTheme.alternate,
    fontWeight: "bold",
  },
  carouselContainer: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  factContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "100%",
  },
  factImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    justifyContent: "flex-end",
  },
  factImageStyle: {
    borderRadius: 20,
  },
  factContent: {
    padding: 8,
  },
  factTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: lightTheme.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  factDescription: {
    fontSize: 16,
    color: lightTheme.textSecondary,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  signUpButton: {
    backgroundColor: lightTheme.alternate,
    width: "80%",
  },
  altButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: lightTheme.alternate,
    width: "80%",
    alignItems: "center",
  },
  termsContainer: {
    alignItems: "center",
    opacity: 0.7,
    marginTop: 10,
    marginBottom: -20,
  },
  termsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  termsText: {
    fontSize: 13,
    color: lightTheme.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  termsLink: {
    color: lightTheme.alternate,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  locationContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    color: lightTheme.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: -10,
  },
});
