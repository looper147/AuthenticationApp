import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import { useAuth } from "../components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const API_BASE_URL = "http://192.168.0.112:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
interface UserInfoProps {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  editMode: boolean;
  invalidUsername: boolean;
  invalidEmail: boolean;
  invalidRole: boolean;
}

const ManageUsers = () => {
  //Authentication context
  const { userId } = useAuth();

  //fetched users
  const [users, setUsers] = useState<UserInfoProps[]>([]);

  //handle readonly to input
  const handleEdit = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, editMode: !user.editMode } : user
      )
    );
  };

  // // get users
  useEffect(() => {
    // Fetch users data and update the 'users' state
    const getUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          //request users
          const response = await api.get(`${API_BASE_URL}/users`);
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error getting users:", error);
      }
    };

    getUsers();
  }, []);

  const onDelete = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
        setUsers(users.filter((user: any) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const update = async (userId: number, user: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const changes = {
          username: user.editUsername,
          email: user.editEmail,
          role: user.editRole,
        };
        await api.patch(`${API_BASE_URL}/users/${userId}`, changes);

        //update user info state to keep the user rendered on update
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? { ...u, ...changes } : u))
        );
        // setUsers(users.filter((user: any) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const onConfirm = (index: number, id: number, user: any) => {
    //username validator
    const setInvalidUsername = (userId: number, status: boolean) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, invalidUsername: status } : user
        )
      );
    };

    //email validator
    const setInvalidEmail = (userId: number, status: boolean) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, invalidEmail: status } : user
        )
      );
    };

    //role validator
    const setInvalidRole = (userId: number, status: boolean) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, invalidRole: status } : user
        )
      );
    };
    const updatedUsers = [...users];
    if (!user.editUsername && !user.editEmail && !user.editRole) {
      //validate specific username
      setInvalidUsername(id, true);
      setInvalidEmail(id, true);
      setInvalidRole(id, true);
    } else if (!user.editUsername) {
      setInvalidUsername(id, false);
    } else if (!user.editEmail) {
      setInvalidUsername(id, false);
      setInvalidEmail(id, true);
    } else if (!user.editRole) {
      setInvalidUsername(id, false);
      setInvalidEmail(id, false);
      setInvalidRole(id, true);
    } else {
      //if all inputs are not empty
      //validate email format
      const validate = (email: any) => {
        const expression =
          /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase());
      };

      //valid email
      if (validate(user.editEmail.trim())) {
        setInvalidUsername(id, false);
        setInvalidEmail(id, false);
        setInvalidRole(id, false);

        const hasNotChanged =
          updatedUsers[index].username === user.editUsername ||
          updatedUsers[index].email === user.editEmail ||
          updatedUsers[index].role === user.editRole;

        //check if anything changed

        updatedUsers[index].editMode = false;
        setUsers(updatedUsers);
        update(id, user);
        console.log("ent");
        setInvalidUsername(id, false);
        setInvalidEmail(id, false);
        setInvalidRole(id, false);

        updatedUsers[index].editMode = false;
      } else {
        setInvalidUsername(id, false);
        setInvalidEmail(id, true);
        setInvalidRole(id, false);
      }
    }
  };

  return (
    <>
      <ScrollView>
        {users.map((user: any, index: any) => (
          <Card style={styles.card} key={index}>
            <Card.Content>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text}>User ID: </Text>
                <TextInput
                  style={[
                    user.editMode ? styles.input : styles.inputRead,
                    { borderWidth: 0 },
                  ]}
                  editable={false}
                  value={user.id.toString()}
                  placeholder={userId.toString()}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text}>Username: </Text>
                <TextInput
                  style={[
                    user.editMode ? styles.input : styles.inputRead,
                    user.invalidUsername ? styles.invalidInput : null,
                  ]}
                  placeholderTextColor={"black"}
                  editable={user.editMode}
                  value={user.editUsername || ""}
                  onChangeText={(text) =>
                    setUsers((prevUsers) =>
                      prevUsers.map((u) =>
                        u.id === user.id ? { ...u, editUsername: text } : u
                      )
                    )
                  }
                  placeholder={
                    user.invalidUsername
                      ? "Please enter a userame"
                      : user.username
                  }
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text}>Email: </Text>
                <TextInput
                  style={[
                    user.editMode ? styles.input : styles.inputRead,
                    user.invalidEmail ? styles.invalidInput : null,
                  ]}
                  placeholderTextColor={"black"}
                  editable={user.editMode}
                  value={user.editEmail || ""}
                  onChangeText={(text) =>
                    setUsers((prevUsers) =>
                      prevUsers.map((u) =>
                        u.id === user.id ? { ...u, editEmail: text } : u
                      )
                    )
                  }
                  placeholder={
                    user.invalidUsername ? "Please enter an email" : user.email
                  }
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text}>Role: </Text>
                <TextInput
                  style={[
                    user.editMode ? styles.input : styles.inputRead,
                    user.invalidRole ? styles.invalidInput : null,
                  ]}
                  placeholderTextColor={"black"}
                  editable={user.editMode}
                  value={user.editRole || ""}
                  onChangeText={(text) =>
                    setUsers((prevUsers) =>
                      prevUsers.map((u) =>
                        u.id === user.id ? { ...u, editRole: text } : u
                      )
                    )
                  }
                  placeholder={
                    user.invalidUsername ? "Please select a role" : user.role
                  }
                />
              </View>
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button onPress={() => onDelete(user.id)}>Delete</Button>
              <Button onPress={() => handleEdit(user.id)}>
                {user.editMode ? "Cancel" : "Edit"}
              </Button>

              {user.editMode ? (
                <Button onPress={() => onConfirm(index, user.id, user)}>
                  Confirm
                </Button>
              ) : null}
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  text: {
    marginBottom: 10,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
    padding: 10,
  },
  inputRead: {
    marginBottom: 10,
    padding: 10,
  },
  invalidInput: {
    borderWidth: 2,
    borderColor: "red",
  },
  actions: {
    justifyContent: "flex-end",
  },
});

export default ManageUsers;
