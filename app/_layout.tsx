import { Stack } from "expo-router";
import "../global.css";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create_battle" />
      <Stack.Screen name="join_battle" />
      <Stack.Screen name="battle" />
    </Stack>
  );
};

export default RootLayout;
