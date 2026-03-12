import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
