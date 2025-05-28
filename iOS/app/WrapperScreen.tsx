import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import * as Notifications from "expo-notifications";
import { WebViewWithSafeMode } from "../components/WebViewWithSafeMode";
import { CustomSplashScreen } from "./SplashScreen";
import { ErrorScreen } from "./ErrorScreen";

type AppState = "splash" | "loading" | "ready" | "error" | "offline";

export const WrapperScreen: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const [isConnected, setIsConnected] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setupNotifications();
    checkNetworkStatus();
  }, []);

  const setupNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      console.log("Notification permissions granted");
    } catch (error) {
      console.warn("Error setting up notifications:", error);
    }
  };

  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const connected = networkState.isConnected ?? false;
      setIsConnected(connected);

      if (!connected && appState !== "splash") {
        setAppState("offline");
      }
    } catch (error) {
      console.warn("Network check failed:", error);
      setIsConnected(false);
      if (appState !== "splash") {
        setAppState("offline");
      }
    }
  };

  const handleSplashFinish = () => {
    if (isConnected) {
      setAppState("loading");
    } else {
      setAppState("offline");
    }
  };

  const handleWebViewLoadStart = () => {
    setAppState("loading");
  };

  const handleWebViewLoadEnd = () => {
    setAppState("ready");
  };

  const handleWebViewError = (error: any) => {
    console.error("WebView error:", error);
    setErrorMessage(error.description || "Failed to load BaseBuzz");
    setAppState("error");
  };

  const handleRetry = async () => {
    await checkNetworkStatus();
    if (isConnected) {
      setAppState("loading");
      setErrorMessage("");
    } else {
      setAppState("offline");
    }
  };

  const renderContent = () => {
    switch (appState) {
      case "splash":
        return <CustomSplashScreen onFinish={handleSplashFinish} />;

      case "offline":
        return <ErrorScreen onRetry={handleRetry} isOffline={true} />;

      case "error":
        return (
          <ErrorScreen
            onRetry={handleRetry}
            isOffline={false}
            errorMessage={errorMessage}
          />
        );

      case "loading":
      case "ready":
        return (
          <WebViewWithSafeMode
            onLoadStart={handleWebViewLoadStart}
            onLoadEnd={handleWebViewLoadEnd}
            onError={handleWebViewError}
          />
        );

      default:
        return <CustomSplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0052FF" />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0052FF",
  },
});

export default WrapperScreen;
