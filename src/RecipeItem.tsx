import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import RecipeDetails from './RecipeDetails';

function RecipeItem(props) {
  const [showDetails, setShowDetails] = useState(false);

  function isValidValue(price, type) {
    const numberPrice = Number(price);
    if (
      numberPrice &&
      numberPrice > 0 &&
      ((type === 'savings' && numberPrice < 15) || type !== 'savings')
    ) {
      return numberPrice;
    }
    return 0;
  }
  function getValueAverage(names, type) {
    var total = 0;
    var items = 0;
    for (const name of names) {
      for (const item of props.sales[name]) {
        var itemValue = '';
        if (type === 'savings') {
          itemValue = item.savings;
        } else {
          itemValue = item.price;
        }
        if (isValidValue(itemValue, type) !== 0) {
          total += isValidValue(itemValue, type);
          items += 1;
        }
      }
    }
    if (items === 0) {
      return 0;
    }
    return total / items;
  }
  function calculateValue(type) {
    var totalValue = 0;
    var ingredients = props.recipes.usedIngredients;
    for (const ingredient of ingredients) {
      if (getValueAverage(ingredient.original, type) !== 0) {
        totalValue += getValueAverage(ingredient.original, type);
      }
    }
    return (Math.round(totalValue * 100) / 100) as unknown as String;
  }

  function formatTitle() {
    if (props.recipes.title.length > 18) {
      return props.recipes.title.substring(0, 16) + '...';
    }
    return props.recipes.title;
  }

  const savings = calculateValue('savings');
  const price = calculateValue('price');
  const title = formatTitle();
  return (
    <TouchableOpacity style={styles.box} onPress={() => setShowDetails(true)}>
      <View style={styles.border}>
        <Image style={styles.image} source={{uri: props.recipes.image}} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.savings}>{'$' + savings}</Text>
        {/* <Text style={styles.price}>{'$' + price}</Text> */}
      </View>
      <RecipeDetails
        showDetails={showDetails}
        onRequestClose={() => setShowDetails(false)}
        recipes={props.recipes}
        sales={props.sales}></RecipeDetails>
    </TouchableOpacity>
  );
}

const styles = {
  box: {
    margin: 10,
    marginRight: 35,
    marginLeft: 0,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    width: 140,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderColor: '#F6F6F6',
  },
  title: {
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 14,
  },
  savings: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B9460',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    color: '#FF6961',
  },
  border: {
    width: 140,
    height: 140,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.15,
    // shadowRadius: 1,
  },
};

export default RecipeItem;
