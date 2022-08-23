import {
  Button,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Dropdown from './Dropdown';
import React from 'react';

function RecipeDetails(props) {
  return (
    <Modal animationType="slide" visible={props.showDetails}>
      <>
        <SafeAreaView>
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
            <View style={styles.button}>
              <Button
                title={'Back'}
                color={'#FFFFFF'}
                onPress={props.onRequestClose}
              />
            </View>
            <View style={styles.button}>
              <Button
                title={'Save'}
                color={'#FFFFFF'}
                onPress={props.onRequestClose}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    </Modal>
  );
}
const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5DB075',
    width: 150,
    borderRadius: 8,
    borderWidth: 5,
    borderColor: '#5DB075',
    marginTop: 15,
    marginHorizontal: 15,
  },
  container: {
    paddingLeft: 15,
    height: Dimensions.get('window').height - 150,
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
