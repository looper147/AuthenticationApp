import { useState } from "react";
import { View } from "react-native";

//react-native-paper components library
import { TextInput, Appbar, Button, Text } from "react-native-paper";
import { RadioButton } from "react-native-paper";

//context store
import { useAuth } from "../components/AuthContext";

//alert component to display clientside and serverside errors
import Alert from "../components/Alert";

const RegisterScreen = () => {
  //Authentication context to register and show serverside errors
  const { register, serversideErr } = useAuth();

  //Helper text to prevent unwanted data formats
  const [helperText, setHelperText] = useState("");

  //input user credentials
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  //user credentials validity
  const [validUsername, setValidUsername] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  //hide/show password
  const [hide, setHide] = useState(true);

  //Choose role radio component
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

  const handleRegisteration = () => {
    // Define an asynchronous function called createUser that takes a user parameter

    //client side validation
    //if all inputs are empty
    if (!username.trim() && !email.trim() && !password.trim() && !role.trim()) {
      setValidUsername(false);
      setValidEmail(false);
      setValidPassword(false);
    } else if (!username.trim()) {
      //if username is empty
      setValidUsername(false);
    } else if (!email.trim()) {
      //if email is empty
      setValidEmail(false);
      setValidUsername(true);
    } else if (!password.trim()) {
      //if password is empty
      setValidPassword(false);
      setValidUsername(true);
      setValidEmail(true);
    } else {
      //if all input are not empty , validate email format
      const validate = (email: any) => {
        const expression =
          /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase());
      };
      //valid email
      if (validate(email.trim())) {
        //if email format is valid prepare send new user request
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
        register(newUser);
        //clear inputs
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
    <>
      <Appbar.Header mode="medium">
        <Appbar.Content title="Register now" />
      </Appbar.Header>

      {/* row 1 */}
      <TextInput
        mode="outlined"
        error={validUsername ? false : true}
        placeholder="Enter a username"
        label={validUsername ? "Username" : "Please enter a username"}
        value={username}
        onChangeText={(username) => setUsername(username)}
      />
      <TextInput
        mode="outlined"
        error={validEmail ? false : true}
        placeholder="Enter a email"
        label={validEmail ? "Email" : "Please enter an email"}
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        mode="outlined"
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
        <Button
          icon={"check"}
          mode="contained"
          onPress={() => handleRegisteration()}
        >
          Register
        </Button>
      </View>

      {/* row 3 */}

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {serversideErr ? <Alert message={serversideErr} /> : null}
        {helperText ? <Alert message={helperText} /> : null}
      </View>
    </>
  );
};

export default RegisterScreen;
