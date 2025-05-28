import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { APP_NAME } from "@env";

interface ErrorScreenProps {
  onRetry: () => void;
  isOffline?: boolean;
  errorMessage?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  onRetry,
  isOffline = false,
  errorMessage,
}) => {
  const getErrorContent = () => {
    if (isOffline) {
      return {
        title: "No Internet Connection",
        message: "Please check your internet connection and try again.",
        icon: "📡",
      };
    }

    return {
      title: "Connection Error",
      message: errorMessage || "Failed to load BaseBuzz. Please try again.",
      icon: "⚠️",
    };
  };

  const { title, message, icon } = getErrorContent();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble? Make sure you're connected to the internet.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0052FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButtonText: {
    color: "#0052FF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default ErrorScreen;
