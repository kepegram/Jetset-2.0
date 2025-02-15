import { StyleSheet, Text, Pressable, View, Image, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useProfile } from "../../../context/profileContext";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../../firebase.config";
import { useTheme } from "../../../context/themeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navigation prop type for type safety when navigating
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  // Context hooks for profile and theme data
  const { profilePicture, displayName, setProfilePicture } = useProfile();
  const { currentTheme, setTheme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);

  const user = getAuth().currentUser;
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // Handle profile picture selection and upload
  const handlePickImage = async () => {
    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as ImagePicker.MediaType,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePicture(uri);

      // Save profile picture URI to Firestore
      if (user) {
        try {
          await setDoc(
            doc(FIREBASE_DB, "users", user.uid),
            { profilePicture: uri },
            { merge: true }
          );
          console.log("Profile picture updated successfully in Firestore.");
        } catch (error) {
          console.error("Failed to save profile picture to Firestore:", error);
        }
      }

      // Cache profile picture locally
      await AsyncStorage.setItem("profilePicture", uri);
    }
  };

  // Handle user logout with confirmation
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setTheme("light"); // Reset theme to light
            FIREBASE_AUTH.signOut();
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Fetch user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
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

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.profileContainer}>
        <View style={styles.userInfoContainer}>
          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>
            {displayName || userName}
          </Text>
        </View>

        <Pressable
          onPress={handlePickImage}
          style={styles.profileImageContainer}
        >
          <View style={styles.profilePictureBackground}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />

            <View style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={20} color="white" />
            </View>
          </View>
        </Pressable>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <View style={styles.optionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              {
                backgroundColor: pressed
                  ? currentTheme.inactive + "20"
                  : "transparent",
              },
            ]}
            onPress={() => navigation.navigate("Edit")}
          >
            <View style={styles.optionContent}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={currentTheme.icon}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                Manage Account
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentTheme.icon}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              {
                backgroundColor: pressed
                  ? currentTheme.inactive + "20"
                  : "transparent",
              },
            ]}
            onPress={() => navigation.navigate("MyTripsMain")}
          >
            <View style={styles.optionContent}>
              <Ionicons
                name="airplane-outline"
                size={24}
                color={currentTheme.icon}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                My Trips
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentTheme.icon}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              {
                backgroundColor: pressed
                  ? currentTheme.inactive + "20"
                  : "transparent",
              },
            ]}
            onPress={() => navigation.navigate("AppTheme")}
          >
            <View style={styles.optionContent}>
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={currentTheme.icon}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                App Theme
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentTheme.icon}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              {
                backgroundColor: pressed
                  ? currentTheme.inactive + "20"
                  : "transparent",
              },
            ]}
            onPress={() => console.log("Security & Privacy pressed")}
          >
            <View style={styles.optionContent}>
              <Ionicons
                name="shield-outline"
                size={24}
                color={currentTheme.icon}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                Security & Privacy
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentTheme.icon}
            />
          </Pressable>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text
            style={[
              styles.logoutButtonText,
              { color: currentTheme.textPrimary },
            ]}
          >
            Sign out
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 80,
  },
  userInfoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "outfit-bold",
  },
  profileImageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profilePictureBackground: {
    width: 130,
    height: 130,
    borderRadius: 65,
    position: "relative",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 65,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  optionsContainer: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
  },
  logoutContainer: {
    alignItems: "center",
    width: "100%",
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
