import { useToast } from "@/hooks/useToast";
import { Match, MatchStatus } from "@/types/match";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "../Toast";

type Props = {
  match: Match;
  onExit?: () => void;
};

const GameBoardHeader = ({ match, onExit }: Props) => {
  const { toast, setToast, info } = useToast();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(match.code);
    info("Match code copied to clipboard!", 2_000);
  };

  return (
    <View className="flex-col  bg-black/80 rounded-xl mx-2 px-2 h-28">
      <Toast toast={toast} onHide={() => setToast(null)} />

      <View className="flex-row ">
        <View className="flex-1 h-full flex-col gap-2 justify-center">
          <Text className="text-white text-start font-mono">
            Name: {match.name}
          </Text>

          <View className="flex-row items-center">
            <Text className="text-white text-center font-mono">
              Code: {match.code}
            </Text>
            <TouchableOpacity onPress={copyToClipboard} activeOpacity={0.8}>
              <MaterialIcons
                name="content-copy"
                size={18}
                color="white"
                className="ml-2"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 h-full flex-col  items-end  justify-start ">
          <TouchableOpacity
            className="flex-row items-center p-2"
            activeOpacity={0.8}
            onPress={onExit}
          >
            <Ionicons name="exit-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center items-center ">
        <Text className="text-white text-center font-mono">
          {match.status === MatchStatus.WAITING && "Pairing..."}
          {match.status === MatchStatus.PLACING &&
            "Place your ships and press ready!"}
        </Text>
      </View>
    </View>
  );
};

export default GameBoardHeader;
