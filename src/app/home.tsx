import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export default function Home() {
  return (
    <ScrollView
        style={{backgroundColor: '#F8FAFC'}}
        contentContainerStyle={{ flexGrow: 1 }}
    >
        <View style={styles.container}>

            <Text style={styles.mainHeading}>
                Choose What You want to Scan
            </Text>

        
            <View style={styles.buttonSection}>
                <Pressable
                    onPress={() => router.push({ pathname: '/scanner', params: { mode: "qr" } })}
                    style={({ pressed }) => [
                    styles.button,
                    styles.qrButton,
                    pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>QR Code</Text>
                </Pressable>

                <Pressable
                    onPress={() => router.push({ pathname: '/scanner', params: { mode: "barcode" } })}
                    style={({ pressed }) => [
                    styles.button,
                    styles.barcodeButton,
                    pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>Barcode</Text>
                </Pressable>

                <Pressable
                    onPress={() => router.push({ pathname: '/plate'})}
                    style={({ pressed }) => [
                    styles.button,
                    styles.plateButton,
                    pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}> Vehicle No Plate</Text>
                </Pressable>
            </View>

        </View>
    </ScrollView>
        
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    mainHeading:{
        marginTop: 20,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    card:{
        backgroundColor: '#ffffff',
        alignItems: 'center',
        borderRadius: 16,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 8,
        opacity: 0.95,
        elevation: 6,
        marginBottom: 10,
        width: "100%",
        maxWidth: 420, 
    },
    header:{
        margin: 3,
        fontSize: 30,
        fontWeight: 'bold',
    },
    buttonSection: {
        width: "90%",
        gap: 12,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    qrButton: {
        backgroundColor: "#2563EB", 
        shadowColor: "#2563EB",
    },
    barcodeButton: {
        backgroundColor: "#0D9488",
        shadowColor: "#0D9488",
    },
    plateButton: {
        backgroundColor: "#D97706", 
        shadowColor: "#D97706",
    },
    buttonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
})