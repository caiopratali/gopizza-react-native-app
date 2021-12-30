import React from "react";
import { NavigationContainer } from '@react-navigation/native';

import { SignIn } from "@screens/SignIn";
import { UserStackRoutes } from "./user.stack.routes";
import { useAuth } from "@hooks/auth";

export const Routes = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      { user ? <UserStackRoutes /> : <SignIn /> }
    </NavigationContainer>
  );
}