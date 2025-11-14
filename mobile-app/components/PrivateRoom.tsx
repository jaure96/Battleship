import React from "react";
import { Text, TextInput } from "react-native";

type Props = {
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
};

const PrivateRoom = ({ roomCode, setRoomCode }: Props) => {
  return (
    <>
      <Text className="font-mono text-md color-white mt-3">
        Enter battle code:
      </Text>

      <TextInput
        value={roomCode}
        className="bg-slate-400/30 color-white/50 rounded-sm font-mono"
        maxLength={6}
        onChangeText={(val) => setRoomCode(val.toUpperCase())}
        placeholder="example: F3GS45"
      />
      <Text className="font-mono text-xs color-white/35">
        {roomCode.length}/6 characters
      </Text>
    </>
  );
};

export default PrivateRoom;
