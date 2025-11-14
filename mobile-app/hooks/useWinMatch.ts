import { useGame } from "@/context/GameContext";
import { MatchStatus } from "@/types/match";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, StatusBar } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const useWinMatch = () => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [isMatchEnd, setIsMatchEnd] = useState(false);
  const [matchEndProps, setMatchEndProps] = useState({
    isWin: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const { match, playerId } = useGame();
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();

  const adUnitId = useMemo(
    () =>
      __DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-2357304452833824/9238465885",
    []
  );
  const interstitial = InterstitialAd.createForAdRequest(adUnitId);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );

    const unsubscribeOpened = interstitial.addAdEventListener(
      AdEventType.OPENED,
      () => {
        if (Platform.OS === "ios")
          // Prevent the close button from being unreachable by hiding the status bar on iOS
          StatusBar.setHidden(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (Platform.OS === "ios") StatusBar.setHidden(false);
        navigate("index");
      }
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
    };
  }, []);

  const onConfirm = useCallback(() => {
    // Show ad if loaded, otherwise navigate immediately
    if (adLoaded) {
      interstitial.show();
    } else {
      navigate("index");
    }
  }, [adLoaded, interstitial, navigate]);

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
