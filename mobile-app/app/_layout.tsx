import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AdMobProvider } from "@/context/AdMobContext/AdMobContext";
import { GameProvider } from "@/context/GameContext";
import "../global.css";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    JetBrainsMono: require("../assets/fonts/JetBrainsMono-VariableFont_wght.ttf"),
    "JetBrainsMono-bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
  });

  if (!fontsLoaded) return null;
  return (
    <AdMobProvider>
      <KeyboardProvider>
        <GameProvider>
          <Slot />
        </GameProvider>
      </KeyboardProvider>
    </AdMobProvider>
  );
};

export default RootLayout;
