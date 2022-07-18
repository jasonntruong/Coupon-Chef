import * as Location from 'expo-location';

import {
  Animated,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import React, {useEffect, useState} from 'react';

import CircularProgress from './src/CircularProgress';
import {WebView} from 'react-native-webview';

const getLocation = async () => {
  const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  let requestStatus = '';
  if (permissionStatus !== 'granted') {
    requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  }

  const last = await Location.getLastKnownPositionAsync();
  console.log('here');
  console.log(JSON.stringify(last));
};

const App = () => {
  const [text, onChangeText] = useState('');
  // useEffect(() => {
  //   (async () => {
  //     let {status} = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       console.log('bad');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     console.log(location);
  //   })();
  // }, []);
  return (
    <>
      <SafeAreaView style={styles.background} />
      <View style={styles.topbar}>
        <Text style={styles.titleText}>Coupon Cooking</Text>
        <Animated.View style={{justifyContent: 'center', flex: 1}}>
          <CircularProgress savingsString={'$41.95'} />
        </Animated.View>
        <TextInput
          onChangeText={onChangeText}
          value={text}
          placeholder="Postal Code"
          maxLength={6}
          onSubmitEditing={() => console.log(text)}
        />
        {/* <Button title="click me" onPress={async () => getLocation()} /> */}
      </View>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          height: Dimensions.get('window').height,
        }}>
        <WebView
          source={{
            uri:
              'https://flipp.com/en-ca/ottawa-on/flyer/5016862-food-basics-flyer?postal_code=' +
              text,
          }}
        />
      </View>
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
