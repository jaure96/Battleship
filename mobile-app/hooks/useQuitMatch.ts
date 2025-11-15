import { useGame } from "@/context/GameContext";
import { MatchStatus } from "@/types/match";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";

const useQuitMatch = () => {
  const { match, cancelMatch, supabase } = useGame();
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

  const cleanupCancelledMatch = async (matchId: string) => {
    if (!supabase) return;
    try {
      // The rpc_cancel_match function now handles the cleanup
      await cancelMatch(matchId);
    } catch (error) {
      console.error("Error cancelling match:", error);
    }
  };

  const onCancel = async () => {
    closeDialog();
  };
  const onConfirm = async (withCancel = true) => {
    if (match && withCancel) {
      await cleanupCancelledMatch(match.id);
    }
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
    if (match?.status !== MatchStatus.CANCELLED) return;
    setMsg({
      title: "Game cancelled",
      subTitle: "The enemy has left the match.",
      showCancel: false,
      visible: true,
      onConfirm: () => onConfirm(false),
      onCancel: () => {},
    });
  }, [match]);

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
