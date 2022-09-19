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
import RecipeItem, {Recipe} from './src/RecipeItem';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CircularProgress from './src/CircularProgress';
import {NavigationContainer} from '@react-navigation/native';
import RNFS from 'react-native-fs';

LogBox.ignoreAllLogs();

function App() {
  const [loading, setLoading] = useState(false); //used to refresh the app until the recipe and sales are fetched from our api
  const [recipes, setRecipes] = useState([]);
  const [sales, setSales] = useState({});
  const [saved, setSaved] = useState([]); //recipes that are saved by the user
  const [history, setHistory] = useState([]); //history of recipes that the user has cooked
  const [moneySaved, setMoneySaved] = useState('0'); //total amount saved from all the recipes they cooked

  //fetch recipe and sales from custom made backend api
  useEffect(() => {
    const fetchRecipesAndSales = async () => {
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

    fetchRecipesAndSales();
  }, []);

  //get saved information from asyncstorage
  useEffect(() => {
    const init = async () => {
      const money = await AsyncStorage.getItem('money');
      const savedItems = await AsyncStorage.getItem('savedItems');
      const historyItems = await AsyncStorage.getItem('historyItems');

      let parsedSaved = [];
      let parsedHistory = [];
      if (savedItems && savedItems !== '') {
        parsedSaved = JSON.parse(savedItems);
      }
      if (historyItems && historyItems !== '') {
        parsedHistory = JSON.parse(historyItems);
      }

      if (Object.keys(sales).length === 0) {
        //reload until sales is fetched from api
        setLoading(!loading);
      } else {
        if (money) {
          //set money saved
          setMoneySaved(money);
        }

        //build the history tab in app with the recipes stored in async storage's historyItems
        if (parsedHistory.length === 0) {
          setHistory([]);
        } else if (parsedHistory) {
          const historyRecipes = parsedHistory.map((recipe: Recipe) => {
            return (
              <RecipeItem
                recipes={recipe}
                sales={sales}
                backPressed={() => setLoading(!loading)}
                saved={false}
                moneySaved={money || '0.00'}
              />
            );
          });
          setHistory(historyRecipes);
        }

        //build the saved tab in app with the recipes stored in async storage's savedItems
        if (parsedSaved.length === 0) {
          setSaved([]);
        } else if (parsedSaved) {
          const save = parsedSaved.map((recipe: Recipe) => {
            return (
              <RecipeItem
                recipes={recipe}
                sales={sales}
                backPressed={() => setLoading(!loading)}
                saved={true}
                moneySaved={money || '0.00'}
              />
            );
          });
          if (save) {
            setSaved(save);
          }
        }
      }
    };
    init();
  }, [loading]);

  //get the API key stored in apikey.txt (not public)
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

  //build all the recipe items
  const recipeItems = recipes.map((recipe: Recipe) => {
    return (
      <RecipeItem
        recipes={recipe}
        sales={sales}
        backPressed={() => setLoading(!loading)}
        saved={false}
        moneySaved={moneySaved}
      />
    );
  });

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.topBackground} />
      <View style={styles.topbar}>
        <Text style={styles.titleText}>Coupon Chef</Text>
        <Animated.View style={{justifyContent: 'center', flex: 1}}>
          <CircularProgress savingsString={'$' + moneySaved} />
        </Animated.View>
      </View>
      <View style={styles.header} />
      <ScrollView style={styles.bottomBackground}>
        <Text style={styles.subtitleText}>Explore</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {recipeItems}
        </ScrollView>
        <Text style={styles.subtitleText}>Saved</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {saved}
        </ScrollView>
        <Text style={styles.subtitleText}>History</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {history}
        </ScrollView>
        {/* Dev button to reset all async storage values
        <Button
          title={'dev force reset'}
          onPress={() => {
            AsyncStorage.setItem('money', '0');
            AsyncStorage.setItem('savedItems', '');
            AsyncStorage.setItem('historyItems', '');
            setLoading(!loading);
          }}
        /> */}
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
