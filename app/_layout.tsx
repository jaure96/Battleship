import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import "../global.css";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    JetBrainsMono: require("../assets/fonts/JetBrainsMono-VariableFont_wght.ttf"),
    "JetBrainsMono-bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
  });

  if (!fontsLoaded) return null; // o un splash screen
  return <Slot />;
};

export default RootLayout;
