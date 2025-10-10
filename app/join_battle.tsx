import GameHeader from "@/components/GameHeader";
import Toast from "@/components/Toast";
import { useGame } from "@/context/GameContext";
import { useMatch } from "@/hooks/useMatch";
import { useToast } from "@/hooks/useToast";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const JoinBattle = () => {
  const { goBack, navigate } = useNavigation();
  const { top } = useSafeAreaInsets();

  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { setMatch } = useGame();
  const { joinMatchByCode } = useMatch(null);
  const { toast, setToast, error: errorFn } = useToast();

  const isDisabled = useMemo(
    () => roomCode.length !== 6 || isJoining,
    [isJoining, roomCode]
  );

  const handleJoinBattle = useCallback(async () => {
    try {
      if (roomCode.length !== 6) return;
      setIsJoining(true);
      const { data, error } = await joinMatchByCode(roomCode);
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
  }, [joinMatchByCode, roomCode]);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <Toast toast={toast} onHide={() => setToast(null)} />
      <View className="flex-1 justify-center items-center bg-background px-6">
        {/* Go back button*/}
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
            {/*
              <View className="flex-row content-center items-center gap-1">
                <Ionicons name="search" color="#ffcc33" size={24} />
                <Text className="font-mono text-xl color-white">
                  Search battle
                </Text>
              </View>
            */}
            <Text className="font-mono text-md color-white mt-3">
              Enter battle code:
            </Text>

            <TextInput
              value={roomCode}
              className="bg-slate-400/30 color-white/50 rounded-sm font-mono"
              maxLength={6}
              onChangeText={(val) => setRoomCode(val)}
              placeholder="example: F3GS45"
            />
            <Text className="font-mono text-xs color-white/35">
              {roomCode.length}/6 characters
            </Text>

            <TouchableOpacity
              className="bg-background h-10 rounded-s my-6 justify-center flex-row items-center gap-3"
              activeOpacity={0.8}
              disabled={isDisabled}
              style={{ opacity: isDisabled ? 0.3 : 1 }}
              onPress={handleJoinBattle}
            >
              <Text className="text-center font-mono-bold text-xl">
                {!isJoining ? "JOIN" : "JOINING..."}
                {isJoining && <ActivityIndicator />}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/*<PublicRooms containerClass="mt-10 px-10" />*/}
      </View>
    </KeyboardAvoidingView>
  );
};

export default JoinBattle;
