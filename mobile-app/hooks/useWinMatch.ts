import { useGame } from "@/context/GameContext";
import { MatchStatus } from "@/types/match";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const useWinMatch = () => {
  const [isMatchEnd, setIsMatchEnd] = useState(false);
  const [matchEndProps, setMatchEndProps] = useState({
    isWin: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const { match, playerId } = useGame();
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const onConfirm = useCallback(() => {
    navigate("index");
  }, [navigate]);

  useEffect(() => {
    if (match?.status !== MatchStatus.FINISHED) return;
    setIsMatchEnd(true);

    if (match.winner_player_id === playerId) {
      setMatchEndProps({
        isWin: true,
        title: "Victory!",
        message: "You have won the battle!",
        onConfirm,
      });
    } else {
      setMatchEndProps({
        isWin: false,
        title: "Defeat!",
        message: "You have lost the battle.",
        onConfirm,
      });
    }
  }, [match?.status, match?.winner_player_id, onConfirm, playerId]);

  return {
    isMatchEnd,
    matchEndProps,
  };
};

export default useWinMatch;
