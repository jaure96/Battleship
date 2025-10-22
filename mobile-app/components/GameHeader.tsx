import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string | null;
  showDivider?: boolean;
};

const SEGMENTS = 20;
const GameHeader = ({ subtitle = null, title, showDivider = false }: Props) => {
  const generateOpacities = () => {
    const opacities = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const progress = i / (SEGMENTS - 1);
      const opacity = Math.sin(progress * Math.PI);
      opacities.push(opacity);
    }
    return opacities;
  };

  const opacities = generateOpacities();

  return (
    <View className="flex w-full flex-col items-center">
      <View className="items-center">
        <Text className="text-foreground text-5xl font-mono">{title}</Text>
        {subtitle && (
          <Text className="text-foreground text-2xl font-mono ">
            {subtitle}
          </Text>
        )}
      </View>
      {showDivider && (
        <View className="w-full h-1 mt-4 flex-row">
          {opacities.map((opacity, index) => (
            <View
              key={index}
              className="flex-1 bg-accent"
              style={{ opacity }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default GameHeader;
