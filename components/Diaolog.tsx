import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type DialogProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const Dialog = ({
  visible,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
}: DialogProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white w-80 rounded-2xl p-5 shadow-lg">
          <Text className="text-xl font-mono-bold text-center mb-3">
            {title}
          </Text>
          <Text className="text-base text-gray-700 text-center mb-6 font-mono">
            {message}
          </Text>

          <View className="flex-row justify-between">
            <Pressable
              onPress={onCancel}
              className="flex-1 mr-2 bg-gray-200 py-2 rounded-xl"
            >
              <Text className="text-center text-gray-800 font-medium font-mono">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 ml-2 bg-blue-500 py-2 rounded-xl"
            >
              <Text className="text-center text-white font-medium font-mono">
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Dialog;
