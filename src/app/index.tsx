import { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

export default function SplaceScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home')
    }, 5000)

    return () => clearTimeout(timer)
  },[])

  return (
    <>
      <View style={styles.container}>
        <Image
          source={{
            uri:"https://img.magnific.com/free-vector/smartphone-scanning-qr-code_23-2148624200.jpg?semt=ais_hybrid&w=740&q=80",
          }}
          style={styles.logo}
        />
        <Text style={styles.header}>EasyScan</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:{
    width: 320,
    height: 320,
    borderRadius: 50,
    resizeMode: "cover"
  },
  header:{
    marginTop: 20,
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  }
});
