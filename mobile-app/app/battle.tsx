import Dialog from "@/components/Diaolog";
import GameBoardHeader from "@/components/GameBoardHeader";
import MatchResultDialog from "@/components/MatchResultDialog";
import RadarAnimation from "@/components/RadarAnimation";
import EnemyTable from "@/components/Tables/EnemyTable";
import MyTable from "@/components/Tables/MyTable";
import Toast from "@/components/Toast";
import { useGame } from "@/context/GameContext";
import useQuitMatch from "@/hooks/useQuitMatch";
import { useToast } from "@/hooks/useToast";
import useWinMatch from "@/hooks/useWinMatch";
import { MatchStatus } from "@/types/match";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Battle = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { match } = useGame();
  const { toast, setToast, error } = useToast();

  const { onExit, msg } = useQuitMatch();
  const { isMatchEnd, matchEndProps } = useWinMatch();

  if (match === null) return null;
  return (
    <View
      className="flex-1 flex-col bg-background gap-4 "
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <Toast toast={toast} onHide={() => setToast(null)} />
      <MatchResultDialog visible={isMatchEnd} {...matchEndProps} />
      <GameBoardHeader match={match} onExit={onExit} />
      <Dialog
        visible={msg.visible}
        onCancel={msg.onCancel}
        onConfirm={msg.onConfirm}
        title={msg.title}
        message={msg.subTitle}
      />

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
            match.status === MatchStatus.IN_PROGRESS ||
            match.status === MatchStatus.FINISHED) && (
            <MyTable toastError={error} />
          )}

          {(match.status === MatchStatus.IN_PROGRESS ||
            match.status === MatchStatus.FINISHED) && (
            <EnemyTable toastError={error} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Battle;
