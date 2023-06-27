import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Button, Card, Title, Paragraph } from "react-native-paper";
import { useAuth } from "../components/AuthContext";

const HomeScreen = () => {
  const { logout, username } = useAuth();

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="logout" onPress={logout} />
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
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    width: "100%",
  },
});

export default HomeScreen;
