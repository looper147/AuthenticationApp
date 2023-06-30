import "react-native-gesture-handler";
import React from "react";

//screens
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DashboardScreen from "./screens/DashboardScreen";

//navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
//authentication context
import { AuthProvider, useAuth } from "./components/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

//icons library
import Icon from "react-native-vector-icons/AntDesign";

const Tab = createBottomTabNavigator();

//what the logged out user sees
const LoggedOutTabs = () => {
  return (
    <Tab.Navigator initialRouteName="Login">
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{ tabBarIcon: ({}) => <Icon name="login" size={25} /> }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{ tabBarIcon: ({}) => <Icon name="adduser" size={25} /> }}
      />
    </Tab.Navigator>
  );
};

//what the logged in user sees
const LoggedinTabs = () => {
  const { role } = useAuth();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({}) => <Icon name="home" size={25} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({}) => <Icon name="profile" size={25} />,
        }}
      />
      {role.trim() === "Admin" ? (
        <Tab.Screen
          component={DashboardScreen}
          name="Dashboard Main"
          options={{
            tabBarIcon: ({}) => <Icon name="profile" size={25} />,
            headerShown: false,
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
};

//in order to keep the loggedIn status in the auth provider
const AuthenticationScreens = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <LoggedinTabs /> : <LoggedOutTabs />;
};

//main rendering app
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <AuthenticationScreens />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
