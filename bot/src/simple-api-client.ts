import axios from 'axios';

const client = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000
});

const displayError = (err: any): void => {
  console.log('Error:', err?.response.data);
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
