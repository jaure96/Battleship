import GameHeader from "@/components/GameHeader";
import PrivateRoom from "@/components/PrivateRoom";
import PublicRooms from "@/components/PublicRooms";
import Toast from "@/components/Toast";
import { useGame } from "@/context/GameContext";
import useAdMob from "@/hooks/useAdMob";
import { useToast } from "@/hooks/useToast";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const JoinBattle = () => {
  const { shouldDisplayAds } = useAdMob();
  const { goBack, navigate } = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isPrivateSearch, setIsPrivateSearch] = useState(true);

  const { setMatch, joinMatchByCode } = useGame();
  const { toast, setToast, error: errorFn } = useToast();

  const isDisabled = useMemo(
    () => roomCode.length !== 6 || isJoining,
    [isJoining, roomCode]
  );

  const adUnitId = useMemo(
    () =>
      __DEV__
        ? TestIds.ADAPTIVE_BANNER
        : "ca-app-pub-2357304452833824/9190364426",
    []
  );

  const handleJoinBattle = useCallback(
    async (code: string) => {
      try {
        if (code.length !== 6) return;
        setIsJoining(true);
        const { data, error } = await joinMatchByCode(code);
        if (error) {
          errorFn(error.message, 3_000);
          setIsJoining(false);
          return;
        }

        if (!error && data) {
          setMatch(data);
          //@ts-ignore
          navigate("battle");
          setIsJoining(false);
        }
      } catch (e) {
        errorFn("Error joining battle. Try again.", 3_000);
        setIsJoining(false);
      }
    },
    [joinMatchByCode, navigate, setMatch, errorFn]
  );

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={0}
      style={{ flex: 1, marginBottom: bottom }}
    >
      <Toast toast={toast} onHide={() => setToast(null)} />
      <View className="flex-1 justify-center items-center bg-background px-6">
        <TouchableOpacity
          className="absolute left-2"
          style={{ top }}
          onPress={() => goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" color="#2e2e2e" size={34} />
        </TouchableOpacity>
        <GameHeader
          title="Join battle"
          subtitle="Find your battleship"
          showDivider
        />

        <View className="w-full mt-10 px-10 pt-5 bg-black/80 rounded-xl">
          <View className="flex justify-center items-center  ">
            <FontAwesome6 name="bomb" color="#ffcc33" size={55} />
          </View>
          <View className="flex-col ">
            <View>
              {/*TODO Toggle private/public */}
              <View className="flex-row content-center items-center gap-1">
                <Ionicons
                  name={`lock-${true ? "closed" : "open"}-outline`}
                  color="#ffcc33"
                  size={24}
                />
                <Text className="font-mono text-xl color-white">
                  {isPrivateSearch ? "Private" : "Public"} battle
                </Text>
              </View>
            </View>

            {isPrivateSearch && (
              <PrivateRoom roomCode={roomCode} setRoomCode={setRoomCode} />
            )}

            {!isPrivateSearch && <PublicRooms />}

            <TouchableOpacity
              className="bg-background h-10 rounded-s my-6 justify-center flex-row items-center gap-3"
              activeOpacity={0.8}
              disabled={isDisabled}
              style={{ opacity: isDisabled ? 0.3 : 1 }}
              onPress={() => handleJoinBattle(roomCode)}
            >
              <Text className="text-center font-mono-bold text-xl">
                {!isJoining ? "JOIN" : "JOINING..."}
                {isJoining && <ActivityIndicator />}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {shouldDisplayAds && (
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={adUnitId}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default JoinBattle;
