import GameBoardHeader from "@/components/GameBoardHeader";
import EnemyTable from "@/components/Tables/EnemyTable";
import MyTable from "@/components/Tables/MyTable";
import { useGame } from "@/context/GameContext";
import { useMatch } from "@/hooks/useMatch";
import useQuitMatch from "@/hooks/useQuitMatch";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Battle = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { match } = useGame();

  const { onExit } = useQuitMatch();
  useMatch(match?.id ?? null);

  console.log(match);

  if (match === null) return null;
  return (
    <ScrollView className="flex-1 bg-background">
      <View
        className="flex-1 flex-col bg-background gap-4 "
        style={{ paddingTop: top, paddingBottom: bottom }}
      >
        <GameBoardHeader match={match} onExit={onExit} />

        <MyTable />

        <EnemyTable />
      </View>
    </ScrollView>
  );
};

export default Battle;
