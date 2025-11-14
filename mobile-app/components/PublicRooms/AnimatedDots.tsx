import React, { useEffect, useState } from "react";
import { Text } from "react-native";

const AnimatedDots = () => {
  const [dots, setDots] = useState("•");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text className="flex-row flex-1  text-white font-mono  ">{dots}</Text>
  );
};

export default AnimatedDots;
