import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useContext } from 'react'
import _ from "lodash";

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import Chart from '../screens/Chart';
import LogOut from "../screens/LogOut";
import { BottomTabParamList, TabOneParamList, ProfileParamList } from '../types';

import { AppContext } from '../provider/AppContext'

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  const {user} = useContext(AppContext);

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      {console.log('this is user--------',user)}
      <BottomTab.Screen
        name="Home"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
          tabBarVisible: _.isEmpty(user) ? false : true
        }}
      />
     {!_.isEmpty(user) && <BottomTab.Screen
        name="Log Out"
        component={LogOut}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />}
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<any>();

function TabOneNavigator(props) {
  console.log('TabOneNavigator======',props)
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Login"
        component={Login}
        options={{ headerTitle: 'Login' }}
      />
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: '' }}
      />
      <TabOneStack.Screen
        name="Profile"
        component={Profile}
        options={{ headerTitle: 'Profile' }}
      />
      <TabOneStack.Screen
        name="Chart"
        component={Chart}
        options={{ headerTitle: 'Chart' }}
      />
    </TabOneStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

// function ProfileNavigator() {
//   return (
//     <ProfileStack.Navigator>
//       <ProfileStack.Screen
//         name="Profile"
//         component={Profile}
//         options={{ headerTitle: 'Tab Two Title' }}
//       />
//     </ProfileStack.Navigator>
//   );
// }
// const ProfileStack = createStackNavigator<ProfileParamList>();

// function ProfileNavigator() {
//   return (
//     <ProfileStack.Navigator>
//       <ProfileStack.Screen
//         name="Profile"
//         component={TabTwoScreen}
//         options={{ headerTitle: 'Profile title' }}
//       />
//     </ProfileStack.Navigator>
//   );
// }
