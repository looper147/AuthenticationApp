import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { TextInput, Appbar, Button, Snackbar } from "react-native-paper";
import { useAuth } from "../components/AuthContext";
import Alert from "../components/Alert";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const { login, serversideErr, clearServersideErr } = useAuth();
  const [show, setShow] = useState(true);

  const [helperText, setHelperText] = useState("");
  const handleLogin = () => {
    //client side validation
    if (!email.trim() && !password.trim()) {
      setValidEmail(false);
      setValidPassword(false);
      return;
    } else if (!email.trim()) {
      setValidEmail(false);
      setValidPassword(true);
      return;
    } else if (!password.trim()) {
      setValidPassword(false);
      setValidEmail(true);
      return;
    } else {
      //if all inputs are not empty

      //validate email format
      const validate = (email: any) => {
        const expression =
          /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase());
      };

      //valid email
      if (validate(email.trim())) {
        setValidEmail(true);
        setValidPassword(true);
        const credentials = {
          email: email,
          password: password,
        };
        login(credentials);
        clearServersideErr();
        setHelperText("");
      } else {
        setValidEmail(false);
        setHelperText("Wrong email format");
      }
    }
  };

  return (
    <>
      <Appbar.Header mode="medium">
        <Appbar.Content title="Login now" />
      </Appbar.Header>
      <View style={styles.container}>
        {/* row 1 */}
        <View style={{ flexDirection: "column" }}>
          <TextInput
            mode="outlined"
            error={validEmail ? false : true}
            placeholder="Enter an email"
            label={validEmail ? "Email" : "Please enter an email"}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
          <TextInput
            mode="outlined"
            error={validPassword ? false : true}
            placeholder="Enter a password"
            label={validPassword ? "Password" : "Please enter a Password"}
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={show}
            right={<TextInput.Icon icon="eye" onPress={() => setShow(!show)} />}
          />
        </View>

        {/* row 2 */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View>
            <Button
              icon={"check"}
              mode="contained"
              onPress={() => handleLogin()}
            >
              Login
            </Button>
          </View>
        </View>
        {/* row 3 */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {serversideErr ? <Alert message={serversideErr} /> : null}
          {helperText ? <Alert message={helperText} /> : null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
export default LoginScreen;
