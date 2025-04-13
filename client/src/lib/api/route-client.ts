import axios from "axios";

import { RouteServiceError, CachedData, PendingRequest } from "../types/route.types";

const ORS_API_BASE_URL = "https://api.openrouteservice.org/v2";
const ORS_API_KEY = process.env.NEXT_PUBLIC_OPENROUTE_API_KEY;

export const routeApiClient = axios.create({
  baseURL: ORS_API_BASE_URL,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json, application/geo+json",
    Authorization: ORS_API_KEY,
  },
});

const pendingRequests = new Map<string, PendingRequest>();
const cachedResponses = new Map<string, CachedData<unknown>>();

routeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error?.message) {
      const newError = new Error(error.response.data.error.message) as RouteServiceError;

      newError.name = "RouteServiceError";
      newError.code = error.response.data.error.code;

      return Promise.reject(newError);
    }

    return Promise.reject(error);
  },
);

export const makeDebounceRequest = async <T>(
  key: string,
  requestFn: () => Promise<T>,
  debounceTime = 300,
): Promise<T> => {
  if (cachedResponses.has(key)) {
    const { timestamp, data } = cachedResponses.get(key)!;

    if (Date.now() - timestamp < 10000) {
      return data as T;
    }
    console.log(`Cache expired for ${key}, removing from cache`);
    cachedResponses.delete(key);
  }

  if (pendingRequests.has(key)) {
    console.log(`Reusing pending request for ${key}`);

    return pendingRequests.get(key)!.promise as Promise<T>;
  }

  const controller = new AbortController();

  let promiseResolve: (value: T) => void;
  let promiseReject: (reason?: unknown) => void;

  const promise = new Promise<T>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  pendingRequests.set(key, {
    controller,
    promise,
  });

  const actualDebounceTime = key.startsWith("route_") ? 50 : debounceTime;

  setTimeout(async () => {
    try {
      const result = await requestFn();

      if (result) {
        cachedResponses.set(key, {
          timestamp: Date.now(),
          data: result,
        });
      } else {
        console.error(`Request for ${key} returned empty result`);
      }

      pendingRequests.delete(key);
      promiseResolve(result);
    } catch (error) {
      console.error(`Request for ${key} failed:`, error);
      pendingRequests.delete(key);
      promiseReject(error);
    }
  }, actualDebounceTime);

  return promise;
};
