import React from "react";
import { View } from "react-native";
import ManageUsersDropdown from "../components/ManageUsersDropdown";
import { createStackNavigator } from "@react-navigation/stack";
import AddUserScreen from "./AddUserScreen";
import ManageUsers from "./ManageUsers";

const Stack = createStackNavigator();

function Content() {
  return (
    <View>
      <ManageUsersDropdown />
      {/* Additional content for the admin dashboard */}
    </View>
  );
}
const DashboardScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Admin Dashboard" component={Content} />
      <Stack.Screen name="Add User" component={AddUserScreen} />
      <Stack.Screen name="Manage Users" component={ManageUsers} />
    </Stack.Navigator>
  );
};

export default DashboardScreen;
