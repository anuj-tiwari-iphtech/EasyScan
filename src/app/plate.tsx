import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { extractPlate, PlateResult } from "../utils/plate";
import { readPlate } from "../utils/plateRecongizer";

export default function PlateScanner() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<PlateResult | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      base64: true,
    });
    if (res.canceled) return;
  
    const asset = res.assets[0];
    setImageUri(asset.uri);
    setResult(null);
    setLoading(true);
  
    try {
        const { plate, country, vehicleType } = await readPlate(asset.base64!);
        const code = country ? country.toUpperCase() : "Not found";
        const vehicle = vehicleType || "Unknown";
        
        if (!plate) {
          setResult({ plate: "Not found", state: "Not found", country: "Not found", vehicleType: "Not found" });
        } else if (country.startsWith("in")) {
          setResult({ ...extractPlate(plate), country: code, vehicleType: vehicle });
        } else {
          setResult({
            plate: plate.toUpperCase(),
            state: "State not Found",
            country: code,
            vehicleType: vehicle,
          });
        }
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not read the image. Try another one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <>
          <Text style={styles.title}>Number Plate Scanner</Text>
          <Pressable style={styles.primaryButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { marginTop: 12 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />

          {loading ? (
            <ActivityIndicator size="large" color="#208AEF" style={{ marginVertical: 24 }} />
          ) : (
            result && (
              <View style={styles.dataCard}>
                <Text style={styles.dataLabel}>Plate Number</Text>
                <Text selectable style={styles.dataValue}>{result.plate}</Text>

                <Text style={[styles.dataLabel, { marginTop: 16 }]}>State</Text>
                <Text selectable style={styles.dataValue}>{result.state}</Text>

                <Text style={[styles.dataLabel, { marginTop: 16 }]}>Country</Text>
                <Text selectable style={styles.dataValue}>{result.country}</Text>

                {/* <Text style={[styles.dataLabel, { marginTop: 16 }]}>Vehicle Type</Text>
                <Text selectable style={styles.dataValue}>{result.vehicleType}</Text> */}
              </View>
            )
          )}

          <View style={styles.actionSection}>
            <Pressable
              style={[styles.primaryButton, loading && { opacity: 0.5 }]}
              onPress={pickImage}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Upload Another</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 24,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: "#E2E8F0",
  },
  dataCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  dataLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dataValue: {
    fontSize: 18,
    color: "#0F172A",
    fontWeight: "600",
  },
  actionSection: { width: "100%", gap: 12 },
  primaryButton: {
    backgroundColor: "#208AEF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#E0F2FE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#0284C7", fontSize: 16, fontWeight: "600" },
});
