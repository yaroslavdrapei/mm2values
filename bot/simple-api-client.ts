import axios from 'axios';

const client = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000
});

export class SimpleApiClient {
  public static async get<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await client.get(endpoint);
      return response.data as T;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public static async post<T>(endpoint: string, body: T): Promise<boolean> {
    try {
      await client.post(endpoint, body);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public static async patch<T>(endpoint: string, body: T): Promise<boolean> {
    try {
      await client.patch(endpoint, body);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public static async delete(endpoint: string): Promise<boolean> {
    try {
      await client.delete(endpoint);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
