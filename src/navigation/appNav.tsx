import React, { useContext, useState } from "react";
import { Alert, Image, Pressable, Text, View, Platform } from "react-native";
import { useTheme } from "../context/themeContext";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { ProfileProvider, useProfile } from "../context/profileContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { CreateTripContext } from "../context/createTripContext";
import Home from "../screens/main/homeScreen/home";
import RecommendedTripDetails from "../screens/main/tripScreens/viewTrip/recommendedTripDetails";
import Profile from "../screens/main/userScreens/profile";
import Edit from "../screens/main/userScreens/edit";
import ChangeUsername from "../screens/main/userScreens/changeUsername";
import ChangePassword from "../screens/main/userScreens/changePassword";
import AppTheme from "../screens/main/userScreens/appTheme";
import DeleteAccount from "../screens/main/userScreens/deleteAccount";
import ReviewTrip from "../screens/main/tripScreens/buildTrip/reviewTrip";
import GenerateTrip from "../screens/main/tripScreens/buildTrip/generateTrip";
import TripDetails from "../screens/main/tripScreens/viewTrip/tripDetails";
import MyTrips from "../screens/main/tripScreens/myTrips";
import CurrentTripDetails from "../screens/main/tripScreens/viewTrip/currentTripDetails";
import IteneraryDetail from "../screens/main/tripScreens/viewTrip/iteneraryDetail";
import HotelDetail from "../screens/main/tripScreens/viewTrip/hotelDetail";
import WhereTo from "../screens/main/tripScreens/buildTrip/whereTo";
import ChoosePlaces from "../screens/main/tripScreens/buildTrip/choosePlaces";
import ChooseDate from "../screens/main/tripScreens/buildTrip/chooseDate";
import WhosGoing from "../screens/main/tripScreens/buildTrip/whosGoing";
import MoreInfo from "../screens/main/tripScreens/buildTrip/moreInfo";
import PopularDestinations from "../screens/main/homeScreen/popularDestinationsDetail";

export type RootStackParamList = {
  Welcome: undefined;
  Carousel: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AppNav: undefined;
  App: undefined;
  HomeMain: undefined;
  PopularDestinations: { destination: any };
  RecommendedTripDetails: { trip: string; photoRef: string };
  MyTripsMain: undefined;
  WhereTo: undefined;
  ChoosePlaces: undefined;
  ChooseDate: undefined;
  WhosGoing: undefined;
  MoreInfo: undefined;
  ReviewTrip: undefined;
  GenerateTrip: undefined;
  TripDetails: { trip: string; photoRef: string; docId: string };
  CurrentTripDetails: { trip: string; photoRef: string };
  IteneraryDetail: {
    place: {
      placeName: string;
      placeDetails: string;
      timeToTravel?: string;
      geoCoordinates?: {
        latitude: number;
        longitude: number;
      };
      placeExtendedDetails?: string;
      placeUrl?: string;
      photoRef?: string;
      rating?: number;
      price?: number;
      isHotel?: boolean;
    };
  };
  HotelDetail: {
    hotel: {
      hotelName: string;
      rating: number;
      price: number;
      photoRef?: string;
      description?: string;
      amenities?: string[];
      bookingUrl?: string;
      geoCoordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
  Profile: undefined;
  Edit: undefined;
  ChangeUsername: undefined;
  ChangePassword: undefined;
  AppTheme: undefined;
  DeleteAccount: undefined;
  Map: undefined;
};

const HomeStack: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="HomeMain"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PopularDestinations"
        component={PopularDestinations}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="RecommendedTripDetails"
        component={RecommendedTripDetails}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

const MyTripsStack: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setTripData } = useContext(CreateTripContext) || {};
  const screens = [
    "WhereTo",
    "ChoosePlaces",
    "ChooseDate",
    "WhosGoing",
    "MoreInfo",
    "ReviewTrip",
    "GenerateTrip",
  ];

  const tripBuilderScreenOptions = ({
    navigation,
    route,
  }: {
    navigation: any;
    route: any;
  }): NativeStackNavigationOptions => {
    const currentScreenIndex = screens.indexOf(route.name) + 1;
    const totalScreens = screens.length;
    const isFirstScreen = route.name === "WhereTo";
    const currentScreen = route.name;
    const previousScreen = screens[screens.indexOf(currentScreen) - 1];

    return {
      headerTransparent: true,
      headerStyle: {
        backgroundColor: "transparent",
      },
      contentStyle: {
        backgroundColor: currentTheme.background,
      },
      headerShadowVisible: false,
      animation: "slide_from_right",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginLeft: 8,
          }}
        >
          <Pressable
            onPress={() => {
              if (isFirstScreen) {
                navigation.navigate("MyTripsMain");
              } else {
                navigation.navigate(previousScreen);
              }
            }}
            style={{ padding: 4 }}
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color={currentTheme.textPrimary}
            />
          </Pressable>
          {!isFirstScreen && (
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Reset Trip",
                  "Are you sure you want to reset? All progress will be lost.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        setTripData?.({});
                        navigation.navigate("MyTripsMain");
                      },
                    },
                  ]
                );
              }}
              style={{ padding: 0 }}
            >
              <Ionicons
                name="refresh"
                size={24}
                color={currentTheme.textPrimary}
              />
            </Pressable>
          )}
        </View>
      ),
      headerRight: () => (
        <Text
          style={{
            color: currentTheme.textPrimary,
            marginRight: 10,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {`Step ${currentScreenIndex} of ${totalScreens}`}
        </Text>
      ),
    };
  };

  return (
    <RootStack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <RootStack.Screen
        name="MyTripsMain"
        component={MyTrips}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="WhereTo"
        component={WhereTo}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ChoosePlaces"
        component={ChoosePlaces}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ChooseDate"
        component={ChooseDate}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="WhosGoing"
        component={WhosGoing}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="MoreInfo"
        component={MoreInfo}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ReviewTrip"
        component={ReviewTrip}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="GenerateTrip"
        component={GenerateTrip}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="TripDetails"
        component={TripDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CurrentTripDetails"
        component={CurrentTripDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="IteneraryDetail"
        component={IteneraryDetail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="HotelDetail"
        component={HotelDetail}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

const ProfileStack: React.FC = () => {
  const { currentTheme } = useTheme();

  const screenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    headerStyle: {
      backgroundColor: currentTheme.background,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={currentTheme.textPrimary}
          style={{ marginLeft: 10 }}
        />
      </Pressable>
    ),
    headerTitleStyle: {
      color: currentTheme.textPrimary,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  const profileScreenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    title: "Your Profile",
    ...screenOptions({ navigation }),
    headerLeft: () => null,
    headerBackVisible: false,
  });

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          ...profileScreenOptions({ navigation }),
          title: "",
          headerShown: false,
        })}
      />
      <RootStack.Screen
        name="Edit"
        component={Edit}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
        })}
      />
      <RootStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Change Password",
        })}
      />
      <RootStack.Screen
        name="AppTheme"
        component={AppTheme}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Delete Account",
        })}
      />
      <RootStack.Screen
        name="ChangeUsername"
        component={ChangeUsername}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Change Username",
        })}
      />
    </RootStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const HIDDEN_TAB_SCREENS = ["GenerateTrip"];

const getTabBarStyle = (route: any): { display?: string } | undefined => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  return HIDDEN_TAB_SCREENS.includes(routeName)
    ? { display: "none" }
    : undefined;
};

const TabNavigator: React.FC = () => {
  const { currentTheme } = useTheme();
  const { profilePicture } = useProfile();

  const tabBarDefaultStyle = {
    height: Platform.OS === "ios" ? 85 : 65,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    paddingTop: 10,
    borderTopWidth: 0,
  };

  const TabIcon = ({
    focused,
    color,
    icon,
    size = 28,
  }: {
    focused: boolean;
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
    size?: number;
  }) => {
    return (
      <View
        style={{
          padding: 5,
          borderRadius: 10,
          backgroundColor: focused
            ? `${currentTheme.alternate}20`
            : "transparent",
        }}
      >
        <Ionicons
          name={
            focused
              ? icon
              : ((icon + "-outline") as keyof typeof Ionicons.glyphMap)
          }
          color={color}
          size={size}
        />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: currentTheme.alternate,
        tabBarInactiveTintColor: currentTheme.inactiveTabIcon,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: -5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const tabBarStyle = {
            ...tabBarDefaultStyle,
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused} color={color} icon="home" />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
      <Tab.Screen
        name="MyTrips"
        component={MyTripsStack}
        options={({ route }) => {
          const tabBarStyle = {
            ...tabBarDefaultStyle,
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            headerShown: false,
            tabBarLabel: "My Trips",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon="airplane"
                size={30}
              />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => {
          const tabBarStyle = {
            ...tabBarDefaultStyle,
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            tabBarLabel: "Profile",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  padding: 3,
                  borderRadius: 20,
                  backgroundColor: focused
                    ? `${currentTheme.alternate}20`
                    : "transparent",
                }}
              >
                <Image
                  source={{ uri: profilePicture }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    borderColor: focused
                      ? currentTheme.alternate
                      : "transparent",
                    borderWidth: 2,
                  }}
                />
              </View>
            ),
          } as BottomTabNavigationOptions;
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNav: React.FC = () => {
  const { theme } = useTheme();
  const [tripData, setTripData] = useState<any>([]);

  return (
    <ProfileProvider>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <RootStack.Navigator initialRouteName="App">
          <RootStack.Screen
            name="App"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </CreateTripContext.Provider>
    </ProfileProvider>
  );
};

export default AppNav;
