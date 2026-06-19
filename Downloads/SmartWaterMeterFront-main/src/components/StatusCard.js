import React from "react";

import { View, Text, StyleSheet } from "react-native";

import colors from "../constants/colors";

export default function StatusCard({ data }) {
  if (!data) return null;

  const getColor = () => {
    if (data.status === "Safe") return colors.success;

    if (data.status === "Unsafe") return colors.danger;

    return colors.warning;
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: getColor(),
        },
      ]}
    >
      <Text style={styles.title}>Water Status: {data.status}</Text>

      <Text style={styles.text}>pH: {data.ph}</Text>

      <Text style={styles.text}>Turbidity: {data.turbidity}</Text>

      <Text style={styles.text}>Temperature: {data.temperature}°C</Text>

      <Text style={styles.text}>TDS: {data.tds} ppm</Text>

      <Text style={styles.time}>
        {new Date(data.timestamp).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,

    padding: 20,

    borderRadius: 18,

    marginBottom: 14,

    borderLeftWidth: 8,

    elevation: 3,
  },

  title: {
    fontSize: 18,

    marginBottom: 10,

    color: colors.textPrimary,

    fontFamily: "Nunito_700Bold",
  },

  text: {
    color: colors.textSecondary,

    marginBottom: 4,

    fontFamily: "Nunito_400Regular",
  },

  time: {
    marginTop: 10,

    color: colors.textSecondary,

    fontSize: 12,

    fontFamily: "Nunito_400Regular",
  },
});
