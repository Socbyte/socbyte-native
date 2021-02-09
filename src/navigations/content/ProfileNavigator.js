import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Profile from "../../scenes/main/Profile";

import EditProfileByPart from "../../scenes/main/EditProfileTabs/EditProfileSingle";
import { EditProfileAbout } from "../../scenes/main/EditProfileTabs/EditProfile";
import ProfileMusic from "../../scenes/main/profileMusic/ProfileMusic";
// import PlayerScreen from "../../scenes/main/profileMusic/test/PlayerScreen";
import MiniPlayer from "../../scenes/main/music/MiniPlayer";
import MusicPlayer from "../../scenes/main/music/MusicPlayer";
import ProfileSearch from "../../scenes/main/ProfileSearch/ProfileSearch";
import ShowSearchedUserProfile from "../../scenes/main/ProfileSearch/ShowSearchedUserProfile";
import ProfileNotification from "../../scenes/main/Notifications/ProfileNotification";
import FollowingTab from "../../scenes/main/ProfileSearch/FollowingsTab";
import FollowTab from "../../scenes/main/ProfileSearch/FollowsTab";

const ProfileStack = createStackNavigator();
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />

      <ProfileStack.Screen name="ProfileMusic" component={ProfileMusic} />
      {/* <ProfileStack.Screen name='ProfileMusic' component={PlayerScreen} /> */}

      <ProfileStack.Screen name="EditProfile" component={EditProfileAbout} />

      <ProfileStack.Screen
        name="EditProfilePart"
        component={EditProfileByPart}
      />

      <ProfileStack.Screen name="ProfileSearch" component={ProfileSearch} />

      <ProfileStack.Screen
        name="ProfileNotification"
        component={ProfileNotification}
      />

      <ProfileStack.Screen
        name="ShowSearchedUserProfile"
        component={ShowSearchedUserProfile}
      />

      <ProfileStack.Screen name="FollowTab" component={FollowTab} />

      <ProfileStack.Screen name="FollowingTab" component={FollowingTab} />
    </ProfileStack.Navigator>
  );
};

const MaterialBottomNavigator = createBottomTabNavigator();
const BottomNavigator = () => {
  return (
    <MaterialBottomNavigator.Navigator
      tabBar={(tabProps) => {
        // console.log(tabProps);
        return <MiniPlayer {...tabProps} />;
      }}
      tabBarOptions={{
        style: {
          height: 10,
        },
      }}
    >
      <MaterialBottomNavigator.Screen
        name="MainProfileScreen"
        component={ProfileNavigator}
      />
    </MaterialBottomNavigator.Navigator>
  );
};

const MainNavigator = createStackNavigator();
const MainProfileNavigation = () => {
  return (
    <MainNavigator.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={{
        animationEnabled: true,
      }}
    >
      <MainNavigator.Screen name="MainScreen" component={BottomNavigator} />

      <MainNavigator.Screen
        name="MainPlayMusicScreen"
        component={MusicPlayer}
      />
    </MainNavigator.Navigator>
  );
};

export default MainProfileNavigation;
