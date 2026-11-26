import axios from 'axios';
import { auth } from '../firebase/firebase.init';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get Firebase ID token', error);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    const isTransientNetworkError = !error?.response;
    const isIdempotentGet = config?.method?.toLowerCase() === 'get';

    if (config && isIdempotentGet && isTransientNetworkError && !config._retried) {
      config._retried = true;
      await new Promise((resolve) => setTimeout(resolve, 800));
      return apiClient(config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
