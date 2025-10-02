import { useNavigation } from "expo-router";
import { Button, Text, View } from "react-native";

const JoinBattle = () => {
  const { goBack } = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Join battle</Text>
      <Button title="go back" onPress={() => goBack()} />
    </View>
  );
};

export default JoinBattle;
