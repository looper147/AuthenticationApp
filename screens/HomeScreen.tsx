import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Card, PaperProvider, Title } from "react-native-paper";
import { useAuth } from "../components/AuthContext";
import { LogoutDialog } from "../components/LogoutDialog";

const HomeScreen = () => {
  const { username } = useAuth();

  return (
    <PaperProvider>
      <View>
        <Appbar.Header>
          <Appbar.Content title="Home" />

          <LogoutDialog />
        </Appbar.Header>

        <Card>
          <Card.Content>
            <Title>Welcome {username}!</Title>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Cover source={require("../images/image1.jpg")} />
        </Card>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    width: "100%",
  },
});

export default HomeScreen;
