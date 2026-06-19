import React from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import colors from "../constants/colors";

export default function LandingScreen({ navigation, onGuest }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Smart Water Monitor</Text>

      <Text style={styles.subtitle}>
        Intelligent water quality monitoring powered by IoT and AI.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.guestButton} onPress={onGuest}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 36,
    fontFamily: "Nunito_700Bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 40,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  secondaryButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  guestButton: {
    padding: 16,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },

  guestText: {
    textAlign: "center",
    color: colors.primary,
    fontFamily: "Nunito_700Bold",
  },
});
