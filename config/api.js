import axios from 'axios';
import { Platform } from 'react-native';

function resolveBaseUrl() {
  // Web runs in the same machine as backend; reuse current hostname
  if (Platform.OS === 'web') {
    const hostname = window?.location?.hostname || 'localhost';
    return `http://${hostname}:4000`;
  }
  // Android emulator routes host via 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }
  // iOS simulator and others can use localhost
  return 'http://localhost:4000';
}

const API_BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_BASE_URL;

