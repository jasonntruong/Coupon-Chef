import {
  Animated,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import CircularProgress from './src/CircularProgress';
import {NavigationContainer} from '@react-navigation/native';
import RNFS from 'react-native-fs';

function App() {
  const [recipes, setRecipes] = useState({});
  useEffect(() => {
    const fetchRecipes = async () => {
      const apiURL = await getRecipesAPI();
      if (apiURL === undefined) {
        return;
      }
      let response = await fetch(apiURL);
      let json = await response.json();

      console.log(json);
      setRecipes(json);
    };

    fetchRecipes();
  }, []);

  async function getRecipesAPI() {
    return RNFS.readDir(RNFS.MainBundlePath)
      .then(result => {
        for (var i in result) {
          if (result[i].isFile() && result[i].name === 'apikey.txt') {
            return RNFS.readFile(result[i].path, 'utf8');
          }
        }
      })
      .then(contents => {
        return contents;
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  }
  if (!recipes) {
    return null;
  }
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.background} />
      <View style={styles.topbar}>
        <Text style={styles.titleText}>Coupon Cooking</Text>
        <Animated.View style={{justifyContent: 'center', flex: 1}}>
          <CircularProgress savingsString={'$41.95'} />
        </Animated.View>
        {/* <TextInput
          placeholder="Postal Code"
          maxLength={6}
          onSubmitEditing={fetchRecipes}
        /> */}
      </View>
      <View></View>
    </NavigationContainer>
  );
}

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
