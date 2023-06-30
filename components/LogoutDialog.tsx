import React, { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useAuth } from "./AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const LogoutDialog = () => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const { logout } = useAuth();

  return (
    <View style={{ padding: 0, marginTop: 4 }}>
      <Button onPress={showDialog} icon={"logout"}>
        Logout
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={() => {
                hideDialog();
                logout();
              }}
              mode="contained"
            >
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
