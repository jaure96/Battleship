import GameHeader from "@/components/GameHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CreateBattle = () => {
  const { goBack } = useNavigation();
  const { top } = useSafeAreaInsets();

  const [roomName, setRoomName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const onRoomNameChange = useCallback((val: string) => {
    setRoomName(val);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
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
          title="Create battle"
          subtitle="Configure you battle"
          showDivider
        />

        <View className="w-full mt-10 px-10 py-5 bg-black/80 rounded-xl">
          <View className="flex justify-center items-center  ">
            <MaterialCommunityIcons name="crown" color="#ffcc33" size={55} />
          </View>
          <View className="flex-col mt-5">
            <Text className="font-mono text-md color-white">Battle name:</Text>
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
          <View className="flex-row items-center justify-between p-4 my-3 border-2 border-border bg-muted/20">
            <View className="flex-row gap-2">
              <View className="flex-row justify-center align-middle items-center  gap-2">
                {isPublic ? (
                  <Ionicons name="eye" color={"#ffcc33"} size={20} />
                ) : (
                  <Ionicons name="eye-off" color={"gray"} size={20} />
                )}
              </View>
              <View className="flex-col justify-items-center align-middle">
                <Text className="text-sm font-mono font-bold text-foreground">
                  Public battle
                </Text>
                <Text className="text-xs text-muted-foreground font-mono">
                  {isPublic ? "Other players can find it" : "Code access only"}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <Switch
                trackColor={{ false: "#767577", true: "#0099e6" }}
                thumbColor={isPublic ? "#204060" : "#a8abb3"}
                onValueChange={() => setIsPublic((prev) => !prev)}
                value={isPublic}
              />
            </View>
          </View>

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
    </KeyboardAvoidingView>
  );
};
export default CreateBattle;
