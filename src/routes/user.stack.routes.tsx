import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from "@screens/Home";
import { Product } from "@screens/Product";
import { Order } from "@screens/Order";
import { useAuth } from "@hooks/auth";
import { UserTabRoutes } from "./user.tab.routes";

const { Navigator, Screen, Group } = createNativeStackNavigator();

export const UserStackRoutes = () => {
  const { user } = useAuth();

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {
        user?.isAdmin ? (
          <Group>
            <Screen name="UserTabRoutes" component={UserTabRoutes} />
            <Screen name="Product" component={Product} />
          </Group>
        ) :
        (
          <Group>
            <Screen name="UserTabRoutes" component={UserTabRoutes} />
            <Screen name="Order" component={Order} />
          </Group>
        )
      }
      
    </Navigator>
  );
}