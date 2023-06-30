/* to avoid passing props I used context, by using context and custom hooks other components in the app can access the 
authentication related data and functions to update their values and do other tasks, easily shared across the app and allowing components
to access,upate and use these values as needed,simplifies the management and sharing of authentication related data and functions
*/
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

import axios from "axios";
const API_BASE_URL = "http://192.168.0.112:3000";

//axios instance with the base url
const api = axios.create({
  baseURL: API_BASE_URL,
});

/*Authentication interceptor attached to the api, intercepts outgoing requests to attach a token to requests, including this interceptor,
 every API request made through the api instance will automatically include the authentication token, ensuring that only authenticated users can access protected endpoints.
validates the user's authentication status on the server side.*/
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//create a context for authentication data and functions, basically a central sotrage
const AuthContext = createContext({
  loggedIn: false,
  userId: 0,
  email: "",
  username: "",
  role: "",
  serversideErr: "",
  serversideErrSetter: (error: string) => {},

  register: (credentials: registerCredentials): Promise<void> =>
    Promise.resolve(),
  login: (credentials: loginCredentials): Promise<void> => Promise.resolve(),
  logout: (): Promise<void> => Promise.resolve(),
  emailSetter: (email: string) => {},
  usernameSetter: (username: string) => {},
  roleSetter: (role: string) => {},
  clearServersideErr: () => {},
});

interface registerCredentials {
  username: string;
  email: string;
  password: string;
  role: string;
}
interface loginCredentials {
  email: string;
  password: string;
}

//custom hook to access the created context (authentication data and functions)
export const useAuth = () => useContext(AuthContext);

//loading screen component
const LoadingScreen = () => (
  <ActivityIndicator
    style={{ flex: 1 }}
    size={"large"}
    animating={true}
    color={MD2Colors.purpleA700}
  />
);

/*wraps the app and provides authentication data and functions to it's children,access the authentication data and functions from the AuthContext easily. 
This allows components to check the user's authentication status, retrieve user information, perform authentication actions, and handle error messages without 
having to pass props explicitly between components.*/
export const AuthProvider = ({ children }: any, { navigation }: any) => {
  //state variables for authentication related data
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [serversideErr, setServersideErr] = useState("");
  const [loading, setLoading] = useState(false);

  //setters to update state variables
  const usernameSetter = (username: string) => {
    setUsername(username);
  };
  const emailSetter = (email: string) => {
    setEmail(email);
  };
  const roleSetter = (role: string) => {
    setRole(role);
  };
  const serversideErrSetter = (error: string) => {
    setServersideErr(error);
  };

  const clearServersideErr = () => {
    setServersideErr("");
  };

  //check if logged in when the component renders
  useEffect(() => {
    checkLoginStatus();
  }, []);

  //check if already logged in and get role to avoid unecessary calls
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // setLoading(true); //start loading
        setLoggedIn(true);
        //get user role
        const response = await api.get(`${API_BASE_URL}/users/user`);
        setLoading(false);
        console.log(response);
      } else {
        navigation.navigate("Register");
      }
    } catch (error: any) {
      if (error.response) {
        setServersideErr(error.response.message);
      } else {
        console.error(error);
      }
    }
  };

  //register a user function
  const register = async (credentials: registerCredentials) => {
    // Run the code until an error occurs
    try {
      // Send a POST request to the specified URL using axios and provide the user object as the request payload
      const response = await axios.post(`${API_BASE_URL}/users`, credentials);
      // Log the response data to the console
      console.log(response);
      setServersideErr("");
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;

        setServersideErr(`Error: ${errorMessage}`);
      } else {
        console.error(error);
      }
      // Catch and handle any errors that occurred during the request
    }
  };

  // log in a user function
  const login = async (credentials: loginCredentials) => {
    try {
      setLoading(true);
      //send credentials
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      // if a token is return successfully
      if (response.data.token) {
        //save returned token
        AsyncStorage.setItem("token", response.data.token);
        setLoggedIn(true);

        //get role and username after successfull login
        const responseUser = await api.get(`${API_BASE_URL}/users/user`);

        setUserId(responseUser.data.user.id);
        setEmail(responseUser.data.user.email);
        setUsername(responseUser.data.user.username);
        setRole(responseUser.data.user.role);
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        setServersideErr(`Error: ${errorMessage}`);
      } else {
        console.error("Request Error:", error.message);
      }
    } finally {
      setLoading(false); //stop loading
    }
  };

  //log out a user function
  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("token");
      setLoggedIn(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //return the provider with the provided data and functions
  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        userId,
        email,
        username,
        role,
        serversideErr,
        serversideErrSetter,
        clearServersideErr,
        register,
        login,
        logout,
        emailSetter,
        usernameSetter,
        roleSetter,
      }}
    >
      {loading ? (
        //render loading screen while loading is true
        <LoadingScreen />
      ) : (
        //render the app when loading stops
        children
      )}
    </AuthContext.Provider>
  );
};
