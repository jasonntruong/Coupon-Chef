import {
  Alert,
  Button,
  Dimensions,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from './Dropdown';

function RecipeDetails(props) {
  const [saved, setSaved] = useState(props.saved);
  function isDecimal(number) {
    if (!number) {
      return null;
    }
    return (
      number.indexOf('.') === -1 ||
      number.indexOf('.') === number.lastIndexOf('.')
    );
  }
  function addStrings(num1, num2) {
    if (isDecimal(num1) && isDecimal(num2)) {
      return parseInt((parseFloat(num1) + parseFloat(num2)) * 100) / 100;
    }
    return null;
  }
  function gotReward(num: number) {
    const milestoneDifference =
      parseInt(num / 100) - parseInt(props.moneySaved / 100);
    if (milestoneDifference > 0) {
      Alert.alert(
        'Congratulations!',
        "You've passed the $100 savings milestone. Treat yourself to " +
          milestoneDifference +
          ' takeout meal(s)',
      );
    }
  }
  async function addToHistory() {
    const historyItems = await AsyncStorage.getItem('historyItems');
    if (!historyItems || historyItems === '') {
      await AsyncStorage.setItem(
        'historyItems',
        JSON.stringify([props.recipes]),
      );
    } else {
      const toHistory = [props.recipes];
      const parsedItems = JSON.parse(historyItems);
      for (var item of parsedItems) {
        toHistory.push(item);
      }
      console.log(toHistory);
      await AsyncStorage.setItem('historyItems', JSON.stringify(toHistory));
    }
  }
  async function purchased() {
    Alert.prompt(
      'Make purchase',
      'How much did you save?',
      [
        {text: 'Cancel'},
        {
          text: 'Purchase',
          onPress: async text => {
            const sum = addStrings(props.moneySaved, text);
            if (sum) {
              await addToHistory();
              await AsyncStorage.setItem('money', sum.toString());
              await gotReward(sum);
              console.log('added to history');
            } else {
              console.log('bad');
            }
            await props.onRequestClose();
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad',
    );
  }
  async function saveItem() {
    const savedItems = await AsyncStorage.getItem('savedItems');
    if (!savedItems || savedItems === '') {
      await AsyncStorage.setItem('savedItems', JSON.stringify([props.recipes]));
    } else {
      const toBeSaved = [props.recipes];
      const parsedItems = JSON.parse(savedItems);
      for (var item of parsedItems) {
        if (item.link === props.recipes.link) {
          return;
        }
        toBeSaved.push(item);
      }
      console.log(toBeSaved);
      setSaved(true);
      await AsyncStorage.setItem('savedItems', JSON.stringify(toBeSaved));
    }
  }

  async function removeItem() {
    const toBeSaved = [];
    const savedItems = await AsyncStorage.getItem('savedItems');
    if (!savedItems || savedItems === '') {
      return;
    }
    for (var item of JSON.parse(savedItems)) {
      if (item.link !== props.recipes.link) {
        toBeSaved.push(item);
      }
    }
    console.log(toBeSaved);
    setSaved(false);

    await AsyncStorage.setItem(
      'savedItems',
      JSON.stringify(toBeSaved.length === 0 ? '' : toBeSaved),
    );
  }

  return (
    <Modal animationType="slide" visible={props.showDetails}>
      <>
        <SafeAreaView>
          <View style={styles.top}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={props.onRequestClose}>
              <Image
                style={{width: 30, height: 30, margin: 10}}
                source={require('../img/back.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable} onPress={purchased}>
              <Image
                style={{width: 30, height: 30, margin: 10}}
                source={require('../img/cart.png')}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.container}>
            <Text style={styles.title}>{props.recipes.title}</Text>
            <View style={styles.border}>
              <Image style={styles.image} source={{uri: props.recipes.image}} />
            </View>
            <Dropdown
              dropped={true}
              style={styles.subtitle}
              title={'Sale Ingredients'}
              type={'Dropdown'}
              sales={props.sales}
              children={props.recipes.usedIngredients}
            />
            <Dropdown
              dropped={true}
              style={styles.subtitle}
              title={'Regular Ingredients'}
              type={'Dropdown'}
              sales={props.sales}
              children={props.recipes.missedIngredients}
            />
          </ScrollView>
          <View style={styles.bottom}>
            <View style={styles.buttonSecondary}>
              <Button
                title={saved ? 'Saved' : 'Save'}
                color={'#5DB075'}
                onPress={() => {
                  saved ? removeItem() : saveItem();
                }}
              />
            </View>
            <View style={styles.buttonPrimary}>
              <Button
                title={'Open'}
                color={'#FFFFFF'}
                onPress={() =>
                  Linking.openURL(
                    'https://spoonacular.com/recipes/' + props.recipes.link,
                  )
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    </Modal>
  );
}
const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  touchable: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    width: 50,
    height: 50,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  buttonPrimary: {
    backgroundColor: '#5DB075',
    width: 150,
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 15,
    marginHorizontal: 15,
  },
  buttonSecondary: {
    borderColor: '#5DB075',
    width: 150,
    borderRadius: 8,
    paddingVertical: 3,
    borderWidth: 2,
    marginTop: 15,
    marginHorizontal: 15,
  },
  container: {
    paddingLeft: 15,
    height: Dimensions.get('window').height - 200,
  },
  title: {
    paddingTop: 30,
    fontSize: 30,
  },
  subtitle: {
    fontSize: 24,
    paddingTop: 30,
  },
  image: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 8,

    borderColor: '#F6F6F6',
  },
  border: {
    marginVertical: 20,

    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F6F6F6',
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').width - 50,
  },
});
export default RecipeDetails;
