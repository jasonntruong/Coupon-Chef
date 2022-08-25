import {
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
import AsyncStorage from '@react-native-async-storage/async-storage';

import Dropdown from './Dropdown';
import React from 'react';

function RecipeDetails(props) {
  function saveItem() {
    const savedItems = await AsyncStorage.getItem('savedItems');
    await AsyncStorage.setItem();
  }

  return (
    <Modal animationType="slide" visible={props.showDetails}>
      <>
        <SafeAreaView>
          <TouchableOpacity
            style={styles.topBar}
            onPress={props.onRequestClose}>
            <Image
              style={{width: 30, height: 30, margin: 10}}
              source={require('../img/back.png')}
            />
          </TouchableOpacity>
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
                title={'Save'}
                color={'#5DB075'}
                onPress={props.onRequestClose}
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
  topBar: {
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
