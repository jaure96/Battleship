import { ToastDef, ToastType } from "@/types/toast";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";

type Props = {
  toast: ToastDef | null;
  onHide: () => void;
};

const Toast = ({ toast, onHide }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!toast) return null;

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-300";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case ToastType.SUCCESS:
        return "check-circle-outline";
      case ToastType.ERROR:
        return "error-outline";
      case ToastType.WARNING:
        return "warning-amber";

      case ToastType.INFO:
      default:
        return "info-outline";
    }
  };

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        className={`${getToastStyles()} rounded-lg shadow-lg p-4 flex-row items-center`}
      >
        <MaterialIcons name={getIcon()} color={"white"} size={20} />
        <Text className="text-white font-medium flex-1 ml-2 font-mono">
          {toast.message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast;
