import {Animated, Dimensions} from 'react-native';
import Svg, {Circle, Text} from 'react-native-svg';

import React from 'react';

const {width} = Dimensions.get('window');
const size = width - 200;
const strokeWidth = 3;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;
const {Value, multiply} = Animated;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface props {
  savingsString: string;
}

export default ({savingsString}: props) => {
  const savings = savingsString.substring(
    1,
    savingsString.length,
  ) as unknown as number;
  const progress = (savings % 100) / 100;
  const progressValue = new Animated.Value(progress);
  const angle = new Value(0);
  Animated.timing(angle, {
    duration: 1200,
    toValue: progressValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.PI * 2],
    }),
    useNativeDriver: true,
  }).start();

  const strokeDashoffset = multiply(angle, radius);
  return (
    <Svg height={size} width={size}>
      <Text
        fill="white"
        fontSize="26"
        fontWeight="500"
        x={size / 2}
        y={size / 2}
        textAnchor="middle">
        {savingsString}
      </Text>
      <Text
        fill="#666666"
        fontSize="12"
        fontWeight="normal"
        x={size / 2}
        y={size / 2 + 22}
        textAnchor="middle">
        {100 - Math.round(savings % 100) + '% left'}
      </Text>
      <Circle
        stroke="white"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        {...{strokeWidth, strokeDashoffset}}
      />
      <AnimatedCircle
        style={{
          transform: [{scaleY: -1}],
        }}
        cx={size / 2}
        cy={-size / 2}
        r={radius}
        stroke="#BDBDBD"
        strokeDasharray={`${circumference}`}
        {...{strokeWidth, strokeDashoffset}}
      />
    </Svg>
  );
};
