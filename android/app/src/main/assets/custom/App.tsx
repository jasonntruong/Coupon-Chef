import {
  Animated,
  Button,
  Dimensions,
  LogBox,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import CircularProgress from './src/CircularProgress';
import {NavigationContainer} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RecipeItem from './src/RecipeItem';

LogBox.ignoreAllLogs();

function App() {
  const [test, setTest] = useState(false);
  const [recipes, setRecipes] = useState({});
  const [sales, setSales] = useState({});
  console.log(test);
  useEffect(() => {
    const fetchRecipes = async () => {
      const apiURL = await getRecipesAPI();
      if (apiURL === undefined) {
        return;
      }
      let recipeResponse = await fetch(apiURL + 'recipes');
      let recipeJson = await recipeResponse.json();
      let saleResponse = await fetch(apiURL + 'sales');
      let saleJson = await saleResponse.json();

      setRecipes(recipeJson);
      setSales(saleJson);
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
  if (Object.keys(recipes).length === 0 || Object.keys(sales).length === 0) {
    return null;
  }
  const recipeItems = recipes.map(recipe => {
    return <RecipeItem recipes={recipe} sales={sales}></RecipeItem>;
  });

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.topBackground} />
      <View style={styles.topbar}>
        <Text style={styles.titleText}>Coupon Chef</Text>
        <Animated.View style={{justifyContent: 'center', flex: 1}}>
          <CircularProgress savingsString={'$41.95'} />
        </Animated.View>
      </View>
      <View style={styles.header} />
      <ScrollView style={styles.bottomBackground}>
        <Text style={styles.subtitleText}>Explore</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {recipeItems}
        </ScrollView>
        <Text style={styles.subtitleText}>Saved</Text>
        <Text style={styles.subtitleText}>History</Text>
        <Button title={'adas'} onPress={() => setTest(!test)}></Button>
      </ScrollView>
      <View style={styles.footer} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 10,
    backgroundColor: 'white',
  },

  footer: {
    height: 40,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  subtitleText: {
    fontSize: 24,
    paddingTop: 30,
    paddingBottom: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 30,
  },
  topBackground: {
    backgroundColor: '#5DB075',
  },
  bottomBackground: {
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
    padding: 15,
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
