import GameHeader from "@/components/GameHeader";
import PublicRooms from "@/components/PublicRooms";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const JoinBattle = () => {
  const { goBack } = useNavigation();
  const { top } = useSafeAreaInsets();

  const [roomCode, setRoomCode] = useState("");

  return (
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
        <View className="flex-col ">
          <View className="flex-row content-center items-center gap-1">
            <Ionicons name="search" color="#ffcc33" size={24} />
            <Text className="font-mono text-xl color-white">Search room</Text>
          </View>
          <Text className="font-mono text-md color-white mt-3">
            Enter room code:
          </Text>

          <TextInput
            value={roomCode}
            className="bg-slate-400/30 color-white/50 rounded-sm font-mono"
            maxLength={7}
            onChangeText={(val) => setRoomCode(val)}
            placeholder="example: d6h38H"
          />
          <Text className="font-mono text-xs color-white/35">
            {roomCode.length}/7 characters
          </Text>

          <TouchableOpacity
            className="bg-background h-10 rounded-s my-6 justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-center font-mono-bold text-xl">JOIN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PublicRooms containerClass="mt-10 px-10" />
    </View>
  );
};

export default JoinBattle;
