import { useNavigation } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert, BackHandler } from "react-native";

const useQuitMatch = () => {
  const navigation = useNavigation();

  const backAction = useCallback(() => {
    Alert.alert(
      "Exit the game",
      "If you leave now you will lose the game and the connection. Do you want to continue?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => {
            //@ts-ignore
            navigation.navigate("index");
          },
        },
      ]
    );
    return true;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, backAction]);

  return { onExit: backAction };
};

export default useQuitMatch;
