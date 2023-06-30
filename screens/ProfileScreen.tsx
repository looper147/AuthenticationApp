import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Divider, Text, TextInput } from "react-native-paper";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alert from "../components/Alert";

const API_BASE_URL = "http://192.168.0.112:3000";

const ProfileScreen = () => {
  const [editMode, setEditmode] = useState(false);
  const {
    userId,
    username,
    email,
    role,
    usernameSetter,
    emailSetter,
    serversideErr,
    serversideErrSetter,
  } = useAuth();
  const [editUsername, setEditUsername] = useState(username);
  const [editEmail, setEditEmail] = useState(email);
  const [valid, setValid] = useState(true);

  const confirmChanges = async () => {
    if (editUsername.trim() && editEmail.trim()) {
      const validateEmail = (email: any) => {
        const expression =
          /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase());
      };

      //if valid email
      if (validateEmail(email.trim())) {
        setValid(true);

        const changes = {
          username: editUsername,
          email: editEmail,
        };

        const token = await AsyncStorage.getItem("token");

        if (token) {
          try {
            usernameSetter(editUsername);
            emailSetter(editEmail);
            const response = await axios.patch(
              `${API_BASE_URL}/users/${userId}`,
              changes,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  // "Content-Type": "applicaton/json",
                },
              }
            );
            setEditmode(false);
          } catch (error: any) {
            if (error.response) {
              serversideErrSetter(`Error ${error.response.data.message}`);
            } else {
              console.error(error);
            }
          }
        } else {
          setValid(false);
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image size={100} source={{}} />
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username:</Text>

          {editMode ? (
            <TextInput
              // style={valid ? styles.input : styles.invalidInput}
              mode="outlined"
              placeholder={username}
              label="New Username"
              value={editUsername}
              onChangeText={setEditUsername}
              style={!valid ? styles.invalidInput : styles.input}
            />
          ) : (
            <Text style={styles.value}>{username}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>

          {editMode ? (
            <TextInput
              // style={valid ? styles.input : styles.invalidInput}
              mode="outlined"
              placeholder={email}
              label="New Email"
              value={editEmail}
              onChangeText={setEditEmail}
              style={!valid ? styles.invalidInput : styles.input}
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{role}</Text>
        </View>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => setEditmode(!editMode)}
        >
          Edit Profile
        </Button>
        {editMode ? (
          <>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => confirmChanges()}
            >
              Confirm
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => setEditmode(false)}
            >
              Cancel
            </Button>
          </>
        ) : null}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {serversideErr ? <Alert message={serversideErr} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: "#888888",
  },
  divider: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    padding: 14,
    fontSize: 16,
  },
  value: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
  },
  input: {
    flex: 1,
  },
  invalidInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
  },
});

export default ProfileScreen;
