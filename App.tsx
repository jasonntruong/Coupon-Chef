import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CircularProgress from './src/CircularProgress';
import React from 'react';

const App = () => {
  return (
    <>
      <SafeAreaView style={styles.background} />
      <View style={styles.topbar}>
        <Text style={styles.titleText}>Coupon Cooking</Text>
        <Animated.View style={{justifyContent: 'center', flex: 1}}>
          <CircularProgress savingsString={'$41.95'} />
        </Animated.View>
      </View>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          height: Dimensions.get('window').height,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  titleText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 30,
  },
  background: {
    backgroundColor: '#5DB075',
  },
  topbar: {
    backgroundColor: '#5DB075',
    height: Dimensions.get('window').height / 2.5,
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
