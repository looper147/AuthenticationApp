import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, RadioButton } from "react-native-paper";
import { useAuth } from "../components/AuthContext";
import Alert from "../components/Alert";

const AddUserScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  const [validUsername, setValidUsername] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const { register, serversideErr } = useAuth();
  const [helperText, setHelperText] = useState("");

  //hide password status
  const [hide, setHide] = useState(true);

  //select role radio component
  const RolesRadio = () => {
    return (
      <View>
        <RadioButton.Group
          onValueChange={(newValue) => setRole(newValue)}
          value={role}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text>Admin</Text>
              <RadioButton value="Admin" />
            </View>

            <View style={{ flex: 1 }}>
              <Text>User</Text>
              <RadioButton value="User" />
            </View>
          </View>
        </RadioButton.Group>
      </View>
    );
  };

  //on add user click
  const handleUser = () => {
    //client side validation
    const inputsAreEmpty =
      !username.trim() && !email.trim() && !password.trim() && !role.trim();
    const isEmpty = (input: any) => {
      return !input.trim() ? true : false;
    };
    if (inputsAreEmpty) {
      setValidUsername(false);
      setValidEmail(false);
      setValidPassword(false);
    } else if (isEmpty(username)) {
      setValidUsername(false);
    } else if (isEmpty(email)) {
      setValidEmail(false);
      setValidUsername(true);
    } else if (isEmpty(password)) {
      setValidPassword(false);
      setValidUsername(true);
      setValidEmail(true);
    } else {
      //if no inputs are empty, validate email format
      const validateEmail = (email: any) => {
        const expression =
          /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase());
      };

      //if valid email
      if (validateEmail(email.trim())) {
        setValidEmail(true);
        setHelperText("");
        setValidPassword(true);
        setValidUsername(true);
        setValidEmail(true);
        const newUser = {
          username: username,
          email: email,
          password: password,
          role: role,
        };
        //call the register method from context to send an api request to create new user
        register(newUser);
        //reset inputs
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setValidEmail(false);
        setValidUsername(true);
        setValidPassword(true);
        setHelperText("Wrong email format");
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* row 1 */}
        <TextInput
          error={validUsername ? false : true}
          placeholder="Enter a username"
          label={validUsername ? "Username" : "Please enter a username"}
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
        <TextInput
          error={validEmail ? false : true}
          placeholder="Enter a email"
          label={validEmail ? "Email" : "Please enter an email"}
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          error={validPassword ? false : true}
          placeholder="Enter a password"
          label={validPassword ? "Password" : "Please enter a password"}
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry={hide}
          right={<TextInput.Icon icon="eye" onPress={() => setHide(!hide)} />}
        />

        {/* row 2 */}

        <RolesRadio />

        <View>
          <Button icon={"check"} mode="contained" onPress={() => handleUser()}>
            Add user
          </Button>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        {serversideErr ? <Alert message={serversideErr} /> : null}
        {helperText ? <Alert message={helperText} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
  userListContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default AddUserScreen;
