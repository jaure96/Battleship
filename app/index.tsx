import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export const Lobby = () => {
  const { navigate } = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-background px-6 ">
      <View className="items-center ">
        <Text className="text-foreground text-5xl font-mono">Battleship</Text>
        <Text className="text-foreground text-2xl font-mono">
          Destroy the enemy fleet
        </Text>
      </View>

      <View className="w-full mt-10 px-10 py-10 bg-black/80 rounded-xl ">
        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center h-10 bg-background rounded-sm mb-3"
          onPress={() => navigate("create_battle")}
          activeOpacity={0.8}
        >
          <Ionicons name="people-outline" color={"black"} size={24} />
          <Text className="text-black text-xl ml-3">Create battle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center h-10 border-background border-2 rounded-sm mb-3"
          onPress={() => navigate("join_battle")}
        >
          <FontAwesome6 name="bomb" color={"#0099e6"} size={24} />
          <Text className="text-background text-xl  ml-3">Join battle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Lobby;
