import GameHeader from "@/components/GameHeader";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useGame } from "../context/GameContext";

export const Lobby = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isLoading, setIsLoading] = useState(false);
  const { createGuest } = useGame();

  const handleNavigate = useCallback(
    async (page: string) => {
      try {
        setIsLoading(true);
        await createGuest(`Guest-${Math.floor(Math.random() * 1000)}`);
        navigation.navigate(page);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Navigation error:", error);
      }
    },
    [createGuest, navigation]
  );

  return (
    <View className="flex-1 justify-center items-center bg-background px-6 ">
      <GameHeader title="Battleship" subtitle=" Destroy the enemy fleet" />

      <View className="w-full mt-10 px-10 py-10 bg-black/80 rounded-xl">
        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center h-10 bg-background rounded-sm mb-3"
          onPress={() => handleNavigate("create_battle")}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <MaterialCommunityIcons name="crown" color={"black"} size={24} />
          <Text className="text-black text-xl ml-3 font-mono">
            Create battle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center h-10 border-background border-2 rounded-sm mb-3"
          onPress={() => handleNavigate("join_battle")}
          disabled={isLoading}
        >
          <FontAwesome6 name="bomb" color={"#0099e6"} size={24} />
          <Text className="text-background text-xl  ml-3 font-mono">
            Join battle
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Lobby;
