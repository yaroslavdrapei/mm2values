import got, { HTTPError } from 'got';
import dotenv from 'dotenv';
dotenv.config();

const client = got.extend({
  prefixUrl: process.env.API_URL,
  headers: {
    authorization: process.env.BACKEND_API_KEY!
  },
  retry: {
    limit: 3,
    calculateDelay: () => 3000
  }
});

const displayError = (err: unknown): void => {
  if (err instanceof HTTPError) {
    console.log('Error:', err.code);
    return;
  }
  console.log(`Unexpected error - ${(err as Error)?.name}: ${(err as Error)?.message}`);
};

export class SimpleApiClient {
  public static removeStartingSlash(endpoint: string): string {
    if (endpoint.startsWith('/')) return endpoint.slice(1);
    return endpoint;
  }

  public static async get<T>(endpoint: string): Promise<T | null> {
    endpoint = this.removeStartingSlash(endpoint);
    try {
      const response = await client.get(endpoint).json();
      return response as T;
    } catch (e) {
      displayError(e);
      return null;
    }
  }

  public static async post<T, V>(endpoint: string, body: T): Promise<V | null> {
    endpoint = this.removeStartingSlash(endpoint);
    try {
      const response = await client.post(endpoint, { json: body, responseType: 'json' });
      return response as V;
    } catch (e) {
      displayError(e);
      return null;
    }
  }

  public static async patch<T, V>(endpoint: string, body: T): Promise<V | null> {
    endpoint = this.removeStartingSlash(endpoint);
    try {
      const response = await client.patch(endpoint, { json: body, responseType: 'json' });
      return response as V;
    } catch (e) {
      displayError(e);
      return null;
    }
  }

  public static async delete<T>(endpoint: string): Promise<T | null> {
    endpoint = this.removeStartingSlash(endpoint);
    try {
      const response = await client.delete(endpoint);
      return response as T;
    } catch (e) {
      displayError(e);
      return null;
    }
  }
}
