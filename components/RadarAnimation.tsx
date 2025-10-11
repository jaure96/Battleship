import React, { RefObject, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const RADAR_SIZE = width * 0.7;
const RADIUS = RADAR_SIZE / 2;

const getAngle = (x: number, y: number) => {
  const dx = x - 0.5;
  const dy = y - 0.5;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return (360 - angle + 90) % 360;
};

export default function Radar() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const beamAngle = useRef(0);

  useEffect(() => {
    const spin = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  rotateAnim.addListener(({ value }) => {
    beamAngle.current = value * 360;
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const BEAM_ANGLE = 90;
  const halfAngle = (BEAM_ANGLE / 2) * (Math.PI / 180);

  const leftX = RADIUS - Math.sin(halfAngle) * RADIUS;
  const leftY = RADIUS - Math.cos(halfAngle) * RADIUS;
  const rightX = RADIUS + Math.sin(halfAngle) * RADIUS;
  const rightY = RADIUS - Math.cos(halfAngle) * RADIUS;

  const trianglePath = `M ${RADIUS} ${RADIUS} L ${leftX} ${leftY} A ${RADIUS} ${RADIUS} 0 0 1 ${rightX} ${rightY} Z`;

  return (
    <View style={{ width: RADAR_SIZE * 1.2, height: RADAR_SIZE * 1.2 }}>
      <Text className="color-border font-mono-bold text-center mb-4 text-xl">
        Waiting your opponent...
      </Text>

      <View className="flex-1 items-center justify-center ">
        <View style={styles.radarCircle}>
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <View
              key={i}
              style={[
                styles.ring,
                { borderColor: "#ffcc33" },
                { width: `${scale * 100}%`, height: `${scale * 100}%` },
              ]}
              //className="border-border/60"
            />
          ))}

          <Animated.View
            style={[
              styles.beamContainer,
              { transform: [{ rotate: rotation }] },
            ]}
          >
            <Svg
              width={RADAR_SIZE}
              height={RADAR_SIZE}
              viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
            >
              <Defs>
                <SvgLinearGradient
                  id="sweepGradient"
                  x1="10%"
                  y1="60%"
                  x2="100%"
                  y2="-20%"
                >
                  <Stop offset="0%" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
                  <Stop
                    offset="20%"
                    stopColor="rgb(255, 204, 51)"
                    stopOpacity="0.2"
                  />
                  <Stop
                    offset="50%"
                    stopColor="rgb(255, 204, 51)"
                    stopOpacity="0.4"
                  />
                  <Stop
                    offset="100%"
                    stopColor="rgb(255, 204, 51)"
                    stopOpacity="1"
                  />
                </SvgLinearGradient>
              </Defs>
              <Path d={trianglePath} fill="url(#sweepGradient)" />
            </Svg>
          </Animated.View>

          <EnemyPoint x={0.8} y={0.6} beamAngleRef={beamAngle} />

          <EnemyPoint x={0.9} y={0.5} beamAngleRef={beamAngle} />

          <EnemyPoint x={0.1} y={0.5} beamAngleRef={beamAngle} />
        </View>
      </View>
    </View>
  );
}

const EnemyPoint = ({
  x,
  y,
  beamAngleRef,
}: {
  x: number;
  y: number;
  beamAngleRef: RefObject<number>;
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const angle = getAngle(x, y);
  const hasBlinked = useRef(false);

  useEffect(() => {
    const checkBeam = () => {
      const currentBeamAngle = beamAngleRef.current;
      const BEAM_WIDTH = 25;

      let diff = Math.abs(currentBeamAngle - angle);
      if (diff > 180) diff = 360 - diff;

      const inBeam = diff <= BEAM_WIDTH / 2;

      if (inBeam && !hasBlinked.current) {
        hasBlinked.current = true;

        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
        ]).start();

        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (!inBeam && hasBlinked.current) {
        hasBlinked.current = false;

        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    const interval = setInterval(checkBeam, 50);
    return () => clearInterval(interval);
  }, [angle]);

  return (
    <Animated.View
      style={[
        styles.enemy,
        {
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor: "#ffcc33",
        },
      ]}
      className="bg-border"
    />
  );
};

const styles = StyleSheet.create({
  radarCircle: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 999,
  },
  beamContainer: {
    position: "absolute",
    width: RADAR_SIZE,
    height: RADAR_SIZE,
  },
  enemy: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    marginTop: -6,
    shadowColor: "lime",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
});
