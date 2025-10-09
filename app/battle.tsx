import GameBoardHeader from "@/components/GameBoardHeader";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const gridSize = 10;
const cells = Array.from({ length: gridSize * gridSize });

const Battle = () => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ScrollView>
      <View
        className="flex-1 flex-col bg-background gap-4 "
        style={{ paddingTop: top, paddingBottom: bottom }}
      >
        {/* Header de la batalla */}
        <GameBoardHeader />

        {/* Tablero del jugador */}
        <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
          <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border">
            {cells.map((_, i) => (
              <View
                key={`player-${i}`}
                className="w-[10%] h-[10%] border border-border bg-blue-600"
              />
            ))}
          </View>
        </View>

        {/* Tablero enemigo */}
        <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
          <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border">
            {cells.map((_, i) => (
              <TouchableOpacity
                key={`enemy-${i}`}
                className="w-[10%] h-[10%] border border-black/80 bg-blue-800 active:bg-blue-700"
                onPress={() => console.log(`Disparo en ${i}`)}
                activeOpacity={0.8}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Battle;
