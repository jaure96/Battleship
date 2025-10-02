import { useNavigation } from "expo-router";
import { Button, Text, View } from "react-native";

const CreateBattle = () => {
  const { goBack } = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Create battle</Text>
      <Button title="go back" onPress={() => goBack()} />
    </View>
  );
};
export default CreateBattle;
