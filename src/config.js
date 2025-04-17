import axios from "axios";

// Get the server URL from the environment variable
const API = import.meta.env.VITE_SERVER_URL;

// Create an Axios instance with baseURL and withCredentials set to true
export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,  // Ensures credentials like cookies are sent with each request
});
