import Constants from "expo-constants";

const { apiBaseUrl } = Constants.expoConfig?.extra ?? {};

export const getBaseUrl = () => {
  if (apiBaseUrl) return String(apiBaseUrl);

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development.
   */
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    throw new Error("Failed to get localhost");
  }
  return `http://${localhost}:3000`;
};
