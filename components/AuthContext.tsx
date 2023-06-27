// to avoid passing props I used context
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

import axios from "axios";
const API_BASE_URL = "http://192.168.0.112:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

//Authentication interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
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
export const useAuth = () => useContext(AuthContext);

const LoadingScreen = () => (
  <ActivityIndicator
    style={{ flex: 1 }}
    size={"large"}
    animating={true}
    color={MD2Colors.purpleA700}
  />
);

export const AuthProvider = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [serversideErr, setServersideErr] = useState("");
  const [loading, setLoading] = useState(false);
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
      }
    } catch (error: any) {
      if (error.response) {
        setServersideErr(error.response.message);
      } else {
        console.error(error);
      }
    }
  };
  const register = async (credentials: registerCredentials) => {
    // Run the code until an error occurs
    try {
      // Send a POST request to the specified URL using axios and provide the user object as the request payload
      const response = await axios.post(`${API_BASE_URL}/users`, credentials);
      // Log the response data to the console
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
        const token = await AsyncStorage.getItem("token");
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
