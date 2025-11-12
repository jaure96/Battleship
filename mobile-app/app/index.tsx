import GameHeader from "@/components/GameHeader";
import useAdMob from "@/hooks/useAdMob";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Lobby = () => {
  const { navigate } = useNavigation<NavigationProp<ParamListBase>>();
  const { bottom } = useSafeAreaInsets();
  const { shouldDisplayAds } = useAdMob();

  const adUnitId = useMemo(
    () =>
      __DEV__
        ? TestIds.ADAPTIVE_BANNER
        : "ca-app-pub-2357304452833824/5553306083",
    []
  );

  return (
    <View className="flex-1 justify-center items-center bg-background px-6 ">
      <GameHeader title="Battleship" subtitle=" Destroy the enemy fleet" />

      <View className="w-full mt-10 px-10 py-10 bg-black/80 rounded-xl">
        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center h-10 bg-background rounded-sm mb-3"
          onPress={() => navigate("create_battle")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="crown" color={"black"} size={24} />
          <Text className="text-black text-xl ml-3 font-mono">
            Create battle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full flex flex-row items-center justify-center h-10 border-background border-2 rounded-sm mb-3"
          onPress={() => navigate("join_battle")}
        >
          <FontAwesome6 name="bomb" color={"#0099e6"} size={24} />
          <Text className="text-background text-xl  ml-3 font-mono">
            Join battle
          </Text>
        </TouchableOpacity>
      </View>

      {shouldDisplayAds && (
        <View className="absolute w-full items-center" style={{ bottom }}>
          <BannerAd
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={adUnitId}
          />
        </View>
      )}
    </View>
  );
};

export default Lobby;
