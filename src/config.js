import axios from "axios"

const API=import.meta.env.client

export const axiosInstance = axios.create({ baseURL: API})