import { useState, useMemo, useRef } from 'react'
import { StyleSheet, Text, View, Pressable,Linking, Button, Dimensions} from 'react-native'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { router, useLocalSearchParams } from 'expo-router';
import { Gesture,GestureDetector } from "react-native-gesture-handler";


export default function scanner(){
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null)
    const [zoom, setZoom] = useState(0)

    const {mode} = useLocalSearchParams();

    const zoomRef = useRef(0);
    const startZoomRef = useRef(0);
    const boxRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  
    const pinchGesture = useMemo(
      () =>
        Gesture.Pinch()
          .runOnJS(true)
          .onBegin(() => {
            startZoomRef.current = zoomRef.current;
          })
          .onUpdate((event) => {
            const newZoom = startZoomRef.current + (event.scale - 1) * 0.5;
            const clamped = Math.max(0, Math.min(1, newZoom));
            zoomRef.current = clamped;
            setZoom(clamped);
          }),
      []
    );
    

    if(!permission){
        return<View style={styles.container}/>
    }

    if(!permission.granted){
        return(
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    We need your permission to use Camera
                </Text>
                <Button onPress={requestPermission} title="Grant Camera Permission"/>
            </View>
        )
    }

    const handleBarcodeScanned = async ({ data, bounds }: BarcodeScanningResult) => {
      if (scanned) return;
    
      const box = boxRef.current;
      if (box && bounds) {
        const PAD = 10; // small tolerance
        const cx = bounds.origin.x + bounds.size.width / 2;
        const cy = bounds.origin.y + bounds.size.height / 2;
    
        const inside =
          cx >= box.x - PAD &&
          cx <= box.x + box.width + PAD &&
          cy >= box.y - PAD &&
          cy <= box.y + box.height + PAD;
    
        if (!inside) return; // code is outside the box, ignore it
      }
    
      setScanned(true);
      setScannedData(data);
    
      const isUrl = data.startsWith("http://") || data.startsWith("https://");
      if (isUrl) {
        const supported = await Linking.canOpenURL(data);
        if (supported) {
          await Linking.openURL(data);
          return;
        }
      }
    };

    const handleResetScan = () =>{
        setScanned(false);
        setScannedData(null);
    }
    
  return (
    <View style={styles.container}>
      {!scanned ? (
        <>
        <GestureDetector gesture={pinchGesture}>
        <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            zoom={zoom}
            barcodeScannerSettings={{
            barcodeTypes:
                mode === "qr"
                ? ["qr"]
                : mode === "barcode"
                ? ["ean13", "ean8", "code128", "code39", "upc_a", "upc_e", "itf14", "codabar"]
                : ["qr", "ean13", "code128", "upc_a"],
            }}
            onBarcodeScanned={handleBarcodeScanned}
        />
        </GestureDetector>
            <View style={styles.overlayContainer} pointerEvents="none">
            <View
              style={styles.scanTargetBox}
              onLayout={(e) => {
                boxRef.current = e.nativeEvent.layout;
              }}
            />
            <Text style={styles.overlayText}>
                Align the {mode === "qr" ? "QR code" : "Barcode"} within the box
            </Text>
            </View>
        </>
      ):(
        <View style={styles.resultContainer}>
          <Text style={styles.resultHeader}>Scan Successful!</Text>
          
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Output:</Text>
            <Text selectable={true} style={styles.dataValue}>{scannedData}</Text>
          </View>

          <View style={styles.actionSection}>
            <Pressable style={styles.primaryButton} onPress={handleResetScan}>
              <Text style={styles.buttonText}>Scan Again</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#0F172A",
  },
  overlayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  scanTargetBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#208AEF",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  overlayText: {
    marginTop: 20,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  resultHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 24,
  },
  dataCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
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
  actionSection: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#208AEF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#E0F2FE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#0284C7",
    fontSize: 16,
    fontWeight: "600",
  },
});
