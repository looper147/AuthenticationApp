import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { useAuth } from "./AuthContext";
interface AlertProps {
  message: string;
}
//display serverside errors
const Alert = ({ message }: AlertProps) => {
  const [visible, setVisible] = useState(true);

  const { serversideErr, clearServersideErr } = useAuth();
  const onToggleSnackBar = () => setVisible(false);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Snackbar
        style={{ backgroundColor: "#ff3333" }}
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Dismiss",
          onPress: () => {
            onToggleSnackBar();
            clearServersideErr();
          },
        }}
      >
        <Text style={{ color: "white" }}>{message}</Text>
      </Snackbar>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default Alert;
