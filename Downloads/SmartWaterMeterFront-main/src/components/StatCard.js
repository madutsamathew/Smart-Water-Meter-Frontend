import React from "react";

import { View, Text, StyleSheet } from "react-native";

import colors from "../constants/colors";

export default function StatCard({ title, value, color }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    width: "48%",
    marginBottom: 14,
    elevation: 4,
  },

  title: {
    fontFamily: "Nunito_400Regular",
    color: colors.textSecondary,
    marginBottom: 8,
  },

  value: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
  },
});
