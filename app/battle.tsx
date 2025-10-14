import GameBoardHeader from "@/components/GameBoardHeader";
import RadarAnimation from "@/components/RadarAnimation";
import EnemyTable from "@/components/Tables/EnemyTable";
import MyTable from "@/components/Tables/MyTable";
import Toast from "@/components/Toast";
import { useGame } from "@/context/GameContext";
import { useMatch } from "@/hooks/useMatch";
import useQuitMatch from "@/hooks/useQuitMatch";
import { useToast } from "@/hooks/useToast";
import { MatchStatus } from "@/types/match";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Battle = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { match } = useGame();
  const { toast, setToast, error: toastError } = useToast();

  const { onExit } = useQuitMatch();
  const { setShipsAndReady, makeMove } = useMatch(match?.id ?? null);

  if (match === null) return null;
  return (
    <View
      className="flex-1 flex-col bg-background gap-4 "
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <Toast toast={toast} onHide={() => setToast(null)} />

      <GameBoardHeader match={match} onExit={onExit} />

      {match.status === MatchStatus.WAITING && (
        <View className="flex-1 items-center justify-center">
          <RadarAnimation />
        </View>
      )}

      {match.status !== MatchStatus.WAITING && (
        <ScrollView
          contentContainerStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {(match.status === MatchStatus.PLACING ||
            match.status === MatchStatus.IN_PROGRESS) && (
            <MyTable
              match={match}
              toast={toast}
              toastError={toastError}
              onShipsReady={setShipsAndReady}
            />
          )}

          {match.status === MatchStatus.IN_PROGRESS && (
            <EnemyTable
              match={match}
              toast={toast}
              toastError={toastError}
              onMakeMove={makeMove}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Battle;
