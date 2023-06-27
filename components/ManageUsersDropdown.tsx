import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { List } from "react-native-paper";

const ManageUsersDropdown = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [exapnded2, setExpanded2] = React.useState(false);

  const navigation = useNavigation();
  const handlePress = (setter: any, value: any) => setter(!value);

  const handleNavigate = (screenName: any): void => {
    navigation.navigate(screenName as never);
  };
  return (
    <List.Section title="Actions">
      <List.Accordion
        title="Manage users"
        left={(props) => <List.Icon {...props} icon="folder" />}
        expanded={expanded}
        onPress={() => handlePress(setExpanded, expanded)}
      >
        <TouchableOpacity onPress={() => handleNavigate("Add User")}>
          <List.Item title="Add user" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate("Manage Users")}>
          <List.Item title="Manage users" />
        </TouchableOpacity>
      </List.Accordion>
    </List.Section>
  );
};

export default ManageUsersDropdown;
