import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { LineChart } from "react-native-chart-kit";

import { signOut } from "firebase/auth";

import { auth } from "../services/firebase";

import useSensorData from "../hooks/useSensorData";

import StatusCard from "../components/StatusCard";

import StatCard from "../components/StatCard";

import colors from "../constants/colors";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ isGuest, userId, onLogout }) {
  const { data, liveReading, error, loading } = useSensorData(isGuest, userId);

  const [, setLastStatus] = useState(null);

  const getColor = (status) => {
    if (status === "Safe") return colors.success;

    if (status === "Unsafe") return colors.danger;

    return colors.warning;
  };

  useEffect(() => {
    const latest = liveReading ?? data[0];
    if (latest) {
      setLastStatus((prev) => {
        if (latest.status !== prev && latest.status === "Unsafe") {
          Alert.alert("Warning", "Unsafe water detected!");
        }
        return latest.status;
      });
    }
  }, [liveReading, data]);

  const latest = liveReading ?? data[0];

  const safeCount = data.filter((item) => item.status === "Safe").length;

  const unsafeCount = data.filter((item) => item.status === "Unsafe").length;

  const avgTemp =
    data.length > 0
      ? (
          data.reduce((acc, item) => acc + item.temperature, 0) / data.length
        ).toFixed(1)
      : 0;

  const avgTDS =
    data.length > 0
      ? (data.reduce((acc, item) => acc + item.tds, 0) / data.length).toFixed(0)
      : 0;

  const handleLogout = async () => {
    if (!isGuest) {
      await signOut(auth);
    }

    onLogout();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Water Dashboard</Text>

          <Text style={styles.subtitle}>
            {liveReading
              ? "Live sensor"
              : isGuest
                ? "Guest Mode"
                : "Premium User"}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            Cannot read live sensor: {error}. Enable Anonymous Auth in Firebase
            Console, or sign in with email.
          </Text>
        </View>
      )}

      {loading && (
        <Text style={styles.loadingText}>Loading sensor data…</Text>
      )}

      {/* MAIN STATUS */}
      {latest && (
        <View style={styles.mainCard} key={latest.receivedAt}>
          <Text style={styles.mainTitle}>Current Water Status</Text>

          <Text
            style={[
              styles.status,
              {
                color: getColor(latest.status),
              },
            ]}
          >
            {latest.status}
          </Text>

          <Text style={styles.timestamp}>
            Updated: {new Date(latest.timestamp).toLocaleString()}
          </Text>
        </View>
      )}

      {/* STATS */}
      <View style={styles.statsRow}>
        <StatCard title="Safe" value={safeCount} color={colors.success} />

        <StatCard title="Unsafe" value={unsafeCount} color={colors.danger} />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Avg Temp"
          value={`${avgTemp}°C`}
          color={colors.secondary}
        />

        <StatCard
          title="Avg TDS"
          value={`${avgTDS} ppm`}
          color={colors.accent}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Records" value={data.length} color={colors.primary} />
      </View>

      {/* PREMIUM */}
      <>
        <Text style={styles.sectionTitle}>Water Analytics</Text>

        {data.length > 0 && (
          <LineChart
            data={{
              labels: data
                .slice(0, 5)
                .reverse()
                .map((_, i) => `${i + 1}`),

              datasets: [
                {
                  data: data
                    .slice(0, 5)
                    .reverse()
                    .map((item) => item.temperature),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: colors.primary,

              backgroundGradientFrom: colors.primary,

              backgroundGradientTo: colors.secondary,

              decimalPlaces: 1,

              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,

              labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        )}
      </>

      {!loading && data.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No readings yet</Text>
          <Text style={styles.emptyText}>
            Power on the ESP32 or POST to /predict. Live path:
            waterQuality/latest
          </Text>
        </View>
      )}

      {/* HISTORY */}
      {data.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Readings</Text>

          {data.slice(0, isGuest ? 3 : 10).map((item, index) => (
            <StatusCard key={`${item.timestamp}-${index}`} data={item} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.background,

    padding: 20,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 20,
  },

  title: {
    fontSize: 30,

    fontFamily: "Nunito_700Bold",

    color: colors.textPrimary,
  },

  subtitle: {
    fontFamily: "Nunito_400Regular",

    color: colors.textSecondary,
  },

  logoutButton: {
    backgroundColor: colors.danger,

    paddingHorizontal: 16,

    paddingVertical: 10,

    borderRadius: 12,
  },

  logoutText: {
    color: "#fff",

    fontFamily: "Nunito_700Bold",
  },

  mainCard: {
    backgroundColor: colors.surface,

    padding: 24,

    borderRadius: 20,

    marginBottom: 20,

    elevation: 4,
  },

  mainTitle: {
    fontFamily: "Nunito_400Regular",

    color: colors.textSecondary,

    marginBottom: 10,
  },

  status: {
    fontSize: 40,

    fontFamily: "Nunito_700Bold",
  },

  timestamp: {
    marginTop: 10,

    color: colors.textSecondary,

    fontFamily: "Nunito_400Regular",
  },

  statsRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 22,

    marginTop: 20,

    marginBottom: 14,

    color: colors.textPrimary,

    fontFamily: "Nunito_700Bold",
  },

  chart: {
    borderRadius: 20,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  emptyText: {
    fontFamily: "Nunito_400Regular",
    color: colors.textSecondary,
    lineHeight: 22,
  },

  errorCard: {
    backgroundColor: "#fde8e8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  errorText: {
    color: colors.danger,
    fontFamily: "Nunito_400Regular",
    lineHeight: 20,
  },

  loadingText: {
    fontFamily: "Nunito_400Regular",
    color: colors.textSecondary,
    marginBottom: 12,
  },

  premiumBanner: {
    backgroundColor: colors.primary,

    padding: 24,

    borderRadius: 20,

    marginTop: 10,
  },

  premiumTitle: {
    color: "#fff",

    fontSize: 22,

    marginBottom: 10,

    fontFamily: "Nunito_700Bold",
  },

  premiumText: {
    color: "#fff",

    fontFamily: "Nunito_400Regular",

    lineHeight: 22,
  },
});
