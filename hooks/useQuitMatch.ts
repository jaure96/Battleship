import { Match } from "@/types/match";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";

const useQuitMatch = (match: Match | null) => {
  const [msg, setMsg] = useState({
    title: "",
    subTitle: "",
    showCancel: true,
    visible: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const closeDialog = () => {
    setMsg((prev) => ({ ...prev, visible: false }));
  };

  const onCancel = () => closeDialog();
  const onConfirm = () => {
    closeDialog();
    navigate("index");
  };

  const onExit = useCallback(() => {
    setMsg({
      title: "Exit the game",
      subTitle:
        "If you leave now you will lose the game and the connection. Do you want to continue?",
      showCancel: true,
      visible: true,
      onCancel,
      onConfirm,
    });

    return true;
  }, [navigate]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onExit
    );
    return () => backHandler.remove();
  }, [onExit]);

  return { onExit, msg };
};

export default useQuitMatch;
