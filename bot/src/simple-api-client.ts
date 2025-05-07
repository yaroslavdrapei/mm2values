import axios, { isAxiosError, AxiosError } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const client = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: {
    authorization: process.env.BACKEND_API_KE!
  }
});

const displayError = (err: any): void => {
  if (isAxiosError(err)) {
    console.log('Error:', (err as AxiosError).response?.data);
    return;
  }
  console.log('Unexpected error:', err);
};

export class SimpleApiClient {
  public static async get<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await client.get(endpoint);
      return response.data as T;
    } catch (e) {
      displayError(e);
      return null;
    }
  }

  public static async post<T, V>(endpoint: string, body: T): Promise<V | null> {
    try {
      const response = await client.post(endpoint, body);
      return response.data as V;
    } catch (e) {
      displayError(e);
      return null;
    }
  }

  public static async patch<T, V>(endpoint: string, body: T): Promise<V | null> {
    try {
      const response = await client.patch(endpoint, body);
      return response.data as V;
    } catch (e) {
      displayError(e);
      return null;
    }
  }

  public static async delete<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await client.get(endpoint);
      return response.data as T;
    } catch (e) {
      displayError(e);
      return null;
    }
  }
}
