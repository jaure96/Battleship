import React, { useEffect } from "react";
import { Dimensions, Modal, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type MatchResultDialogProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isWin?: boolean;
};

const ConfettiParticle = ({ index }: { index: number }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const size = Math.random() * 10 + 5;
  const color = `hsl(${Math.random() * 360}, 70%, 70%)`;
  const shapeType = Math.floor(Math.random() * 3);

  const startAnimation = () => {
    const duration = Math.random() * 2000 + 3000;
    const startX = Math.random() * screenWidth * 1.2 - screenWidth * 0.6;
    const endX = Math.random() * screenWidth * 1.2 - screenWidth * 0.6;

    translateX.value = withRepeat(
      withSequence(
        withTiming(startX, { duration: 0 }),
        withTiming(endX, { duration: duration, easing: Easing.linear })
      ),
      -1,
      true
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-50, { duration: 0, easing: Easing.linear }),
        withTiming(screenHeight + 50, {
          duration: duration,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    );

    rotate.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1, { duration: duration - 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  };

  useEffect(() => {
    const initialDelay = Math.random() * 2000;
    const timeoutId = setTimeout(() => {
      startAnimation();
    }, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const renderShape = () => {
    switch (shapeType) {
      case 0:
        return (
          <View
            className="rounded-full"
            style={{ width: size, height: size, backgroundColor: color }}
          />
        );
      case 1:
        return (
          <View style={{ width: size, height: size, backgroundColor: color }} />
        );
      case 2:
        return (
          <Svg height={size} width={size} viewBox="0 0 100 100">
            <Polygon points="50,0 100,100 0,100" fill={color} />
          </Svg>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      key={index}
      className="absolute"
      style={[
        {
          left: screenWidth / 2,
          top: -10,
        },
        animatedStyle,
      ]}
    >
      {renderShape()}
    </Animated.View>
  );
};

const Confetti = () => {
  const particles = Array.from({ length: 100 }).map((_, i) => (
    <ConfettiParticle key={i} index={i} />
  ));

  return <View className="absolute inset-0 overflow-hidden">{particles}</View>;
};

const RaindropParticle = ({ index }: { index: number }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const size = Math.random() * 2 + 1;
  const duration = Math.random() * 1500 + 2000;
  const startX = Math.random() * screenWidth;

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-50, { duration: 0 }),
        withTiming(screenHeight + 50, {
          duration: duration,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1, { duration: duration - 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      key={index}
      className="absolute w-0.5 bg-blue-400"
      style={[
        {
          left: startX,
          height: size * 10,
          width: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const RainEffect = () => {
  const raindrops = Array.from({ length: 100 }).map((_, i) => (
    <RaindropParticle key={i} index={i} />
  ));

  return <View className="absolute inset-0 overflow-hidden">{raindrops}</View>;
};

const MatchResultDialog = ({
  visible,
  title = "Game Over",
  message = "Result",
  onConfirm,
  onCancel,
  isWin = false,
}: MatchResultDialogProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        {isWin ? <Confetti /> : <RainEffect />}
        <View className="bg-white w-80 rounded-2xl p-5 shadow-lg">
          <Text className="text-xl font-mono-bold text-center mb-3">
            {title}
          </Text>
          <Text className="text-base text-gray-700 text-center mb-6 font-mono">
            {message}
          </Text>

          <View className="flex-row justify-between">
            {onCancel && (
              <Pressable
                onPress={onCancel}
                className="flex-1 mr-2 bg-gray-200 py-2 rounded-xl"
              >
                <Text className="text-center text-gray-800 font-medium font-mono">
                  Cancel
                </Text>
              </Pressable>
            )}

            {onConfirm && (
              <Pressable
                onPress={onConfirm}
                className="flex-1 ml-2 bg-blue-500 py-2 rounded-xl"
              >
                <Text className="text-center text-white font-medium font-mono">
                  OK
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MatchResultDialog;
