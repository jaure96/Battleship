import GameHeader from "@/components/GameHeader";
import PrivateRoom from "@/components/PrivateRoom";
import PublicRooms from "@/components/PublicRooms";
import Toast from "@/components/Toast";
import { useGame } from "@/context/GameContext";
import useAdMob from "@/hooks/useAdMob";
import { useToast } from "@/hooks/useToast";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  // Animation values for lock icons
  const lockOpenRotation = useMemo(() => new Animated.Value(0), []);
  const lockOpenOpacity = useMemo(() => new Animated.Value(1), []);
  const lockClosedRotation = useMemo(() => new Animated.Value(0), []);
  const lockClosedOpacity = useMemo(() => new Animated.Value(0), []);

  // Trigger animation when switch toggles
  useEffect(() => {
    if (isPrivateSearch) {
      // Animate to private (lock-closed visible)
      Animated.parallel([
        Animated.timing(lockOpenRotation, {
          toValue: 180,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(lockOpenOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(lockClosedRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(lockClosedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate to public (lock-open visible)
      Animated.parallel([
        Animated.timing(lockOpenRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(lockOpenOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(lockClosedRotation, {
          toValue: -180,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(lockClosedOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    isPrivateSearch,
    lockOpenRotation,
    lockOpenOpacity,
    lockClosedRotation,
    lockClosedOpacity,
  ]);

  const { joinMatchByCode } = useGame();
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
          //@ts-ignore
          navigate("battle");
          setIsJoining(false);
        }
      } catch {
        errorFn("Error joining battle. Try again.", 3_000);
        setIsJoining(false);
      }
    },
    [joinMatchByCode, navigate, errorFn]
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
            <View className="flex-row content-between w-full items-center my-3">
              <View className="flex-1 flex-row ">
                <Text className="font-mono text-xl color-white">
                  {isPrivateSearch ? "Private battle" : "Public battles"}
                </Text>
              </View>

              <View className="flex-row">
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotateZ: lockOpenRotation.interpolate({
                          inputRange: [0, 180],
                          outputRange: ["0deg", "180deg"],
                        }),
                      },
                    ],
                    opacity: lockOpenOpacity,
                  }}
                >
                  <Ionicons
                    name={`lock-closed-outline`}
                    color="#ffcc33"
                    size={24}
                  />
                </Animated.View>
                <Switch
                  trackColor={{ false: "#767577", true: "#0099e6" }}
                  thumbColor={!isPrivateSearch ? "#204060" : "#a8abb3"}
                  onValueChange={() => setIsPrivateSearch((prev) => !prev)}
                  value={!isPrivateSearch}
                />
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotateZ: lockClosedRotation.interpolate({
                          inputRange: [-180, 0],
                          outputRange: ["-180deg", "0deg"],
                        }),
                      },
                    ],
                    opacity: lockClosedOpacity,
                  }}
                >
                  <Ionicons
                    name={`lock-open-outline`}
                    color="#ffcc33"
                    size={24}
                  />
                </Animated.View>
              </View>
            </View>

            {isPrivateSearch && (
              <>
                <PrivateRoom roomCode={roomCode} setRoomCode={setRoomCode} />
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
              </>
            )}

            {!isPrivateSearch && (
              <PublicRooms onJoinBattle={handleJoinBattle} onError={errorFn} />
            )}
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
