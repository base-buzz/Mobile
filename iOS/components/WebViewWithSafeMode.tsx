import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { WebView } from "react-native-webview";
import type {
  WebViewNavigationEvent,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from "react-native-webview/lib/WebViewTypes";
import * as Network from "expo-network";
import { BASE_URL } from "@env";
import {
  getSafeModeInjectionScript,
  getWalletFallbackScript,
  isSafeModeEnabled,
} from "../lib/safeMode";

interface WebViewWithSafeModeProps {
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
}

export const WebViewWithSafeMode: React.FC<WebViewWithSafeModeProps> = ({
  onLoadStart,
  onLoadEnd,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(BASE_URL);

  useEffect(() => {
    checkNetworkStatus();
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected ?? false);
    } catch (error) {
      console.warn("Network check failed:", error);
      setIsConnected(false);
    }
  };

  const handleLoadStart = (event: WebViewNavigationEvent) => {
    console.log("WebView loading:", event.nativeEvent.url);
    onLoadStart?.();
  };

  const handleLoadEnd = (event: WebViewNavigationEvent | WebViewErrorEvent) => {
    console.log("WebView loaded:", event.nativeEvent.url);
    setCurrentUrl(event.nativeEvent.url);

    // Only inject scripts if this is a successful load (WebViewNavigationEvent)
    if ("navigationType" in event.nativeEvent && webViewRef.current) {
      const safeModeScript = getSafeModeInjectionScript();
      const walletFallbackScript = getWalletFallbackScript();

      if (safeModeScript) {
        webViewRef.current.injectJavaScript(safeModeScript);
      }

      webViewRef.current.injectJavaScript(walletFallbackScript);
    }

    onLoadEnd?.();
  };

  const handleError = (event: WebViewErrorEvent) => {
    const { nativeEvent } = event;
    console.error("WebView error:", nativeEvent);

    Alert.alert(
      "Connection Error",
      "Failed to load BaseBuzz. Please check your internet connection and try again.",
      [
        { text: "Retry", onPress: () => reload() },
        { text: "Cancel", style: "cancel" },
      ]
    );

    onError?.(nativeEvent);
  };

  const handleHttpError = (event: WebViewHttpErrorEvent) => {
    const { nativeEvent } = event;
    console.error("WebView HTTP error:", nativeEvent);

    if (nativeEvent.statusCode && nativeEvent.statusCode >= 400) {
      Alert.alert(
        "Server Error",
        `BaseBuzz returned an error (${nativeEvent.statusCode}). Please try again later.`,
        [
          { text: "Retry", onPress: () => reload() },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log("WebView message:", message);

      // Handle messages from the web app if needed
      if (message.type === "wallet_connect_request") {
        Alert.alert(
          "Wallet Connection",
          "Please use WalletConnect for secure wallet connections.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.warn("Failed to parse WebView message:", error);
    }
  };

  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const goBack = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  if (!isConnected) {
    return null; // Let parent handle offline state
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: BASE_URL }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleHttpError}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={Platform.OS === "ios"}
        bounces={false}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        userAgent={`BaseBuzzApp/1.0 ${
          Platform.OS === "ios" ? "iOS" : "Android"
        } SafeMode:${isSafeModeEnabled()}`}
        injectedJavaScriptBeforeContentLoaded={`
          // Inject scripts before content loads
          ${getWalletFallbackScript()}
          
          // Add message posting capability
          window.ReactNativeWebView = {
            postMessage: function(data) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }
          };
        `}
        onShouldStartLoadWithRequest={(request) => {
          // Allow navigation within BaseBuzz domain and common web3 domains
          const allowedDomains = [
            "base.buzz",
            "www.base.buzz",
            "walletconnect.org",
            "bridge.walletconnect.org",
          ];

          const url = new URL(request.url);
          const isAllowed = allowedDomains.some(
            (domain) =>
              url.hostname === domain || url.hostname.endsWith("." + domain)
          );

          if (!isAllowed) {
            console.log("Blocked navigation to:", request.url);
            return false;
          }

          return true;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0052FF",
  },
  webview: {
    flex: 1,
  },
});

export default WebViewWithSafeMode;
