import React, { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { Platform } from 'react-native';
import { useTheme } from "styled-components/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Orders } from "@screens/Orders";
import { Home } from "@screens/Home";
import { BottomMenu } from "@components/BottomMenu";

const { Navigator, Screen } = createBottomTabNavigator();

export const UserTabRoutes = () => {
  const [notifications, setNotification] = useState('0');

  const { COLORS } = useTheme();

  useEffect(() => {
    const subscribe = firestore()
    .collection('orders')
    .where('status', '==', 'Pronto')
    .onSnapshot(querySnapshot => setNotification(String(querySnapshot.docs.length)));

    return () => subscribe();
  }, []);

  return (
    <Navigator 
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0
        }
      }}
    >
      <Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardápio" color={color} />
          )
        }}
      />
      <Screen 
        name="Orders" 
        component={Orders} 
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Pedidos" color={color} notifications={notifications} />
          )
        }}
      />
    </Navigator>
  )
}