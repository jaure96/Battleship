import GameHeader from "@/components/GameHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CreateBattle = () => {
  const { goBack } = useNavigation();
  const { top } = useSafeAreaInsets();

  const [roomName, setRoomName] = useState("");

  const onRoomNameChange = useCallback((val: string) => {
    setRoomName(val);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      {/* Go back button*/}
      <View className="absolute left-2" style={{ top }}>
        <TouchableOpacity
          className=""
          onPress={() => goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" color="#2e2e2e" size={34} />
        </TouchableOpacity>
      </View>

      <GameHeader
        title="Create room"
        subtitle="Configure you battle"
        showDivider
      />

      <View className="w-full mt-10 px-10 py-5 bg-black/80 rounded-xl">
        <View className="flex justify-center items-center  ">
          <MaterialCommunityIcons name="crown" color="#ffcc33" size={64} />
        </View>
        <View className="flex-col mt-5">
          <Text className="font-mono text-lg color-white">Room name:</Text>
          <TextInput
            value={roomName}
            className="bg-slate-400/30 color-white/50 rounded-sm font-mono"
            maxLength={30}
            onChangeText={onRoomNameChange}
          />
          <Text className="font-mono text-xs color-white/35">
            {roomName.length}/30 characters
          </Text>
        </View>

        {/*Public or private room */}
        <View></View>

        {/*Button*/}
        <TouchableOpacity
          className="bg-background h-10 rounded-s my-6 justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-center font-mono-bold text-xl">CREATE</Text>
        </TouchableOpacity>

        {/*Divider*/}
        <View className="h-[1] f-full bg-border my-3" />

        {/*Disclaimer*/}
        <View className="f-full text-center ">
          <Text className="text-foreground/70 font-mono text-xs text-center">
            You will be the captain of this battle
          </Text>
        </View>
      </View>
    </View>
  );
};
export default CreateBattle;
