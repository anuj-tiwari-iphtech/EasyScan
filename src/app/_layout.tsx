import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return( 
    <GestureHandlerRootView style={{ flex : 1}}>
    <Stack>
      <Stack.Screen name='index'  options={{headerShown: false}}/>
      <Stack.Screen name='home'  options={{
        headerShown: true,
        title: 'EasyScan',
        headerStyle:{backgroundColor: "#208AEF"},
        headerTintColor: '#ffffff',
        headerTitleStyle:{
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}/>
      <Stack.Screen
        name='scanner'
        options={{
          headerShown: false,
          title: 'Scan Code',
          headerStyle:{backgroundColor: "#208AEF"},
          headerTintColor: '#ffffff',
          presentation: 'modal',
          headerBackTitle: 'Cancel',
        }}
      />
      <Stack.Screen name="plate" options={{ title: "Plate Scanner" }} />
    </Stack>
    </GestureHandlerRootView>
  );
}
