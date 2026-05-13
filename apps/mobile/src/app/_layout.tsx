import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';
import '../global.css';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#181A1F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="events" />
        <Stack.Screen name="sermons" />
        <Stack.Screen name="prayer" />
      </Stack>
    </View>
  );
}
