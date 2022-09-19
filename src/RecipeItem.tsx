import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import RecipeDetails from './RecipeDetails';

export type Sale = {
  store: string;
  item: string;
  price: string;
  savings: string;
  url: string;
};

export type Sales = {[sale: string]: [Sale]};
export type Ingredient = {
  amount: number;
  unit: string;
  name: string;
  original: [string];
  image: string;
};
export type Recipe = {
  title: string;
  link: string;
  image: string;
  missedIngredients: [Ingredient];
  usedIngredients: [Ingredient];
};
interface Props {
  sales: Sales;
  recipes: Recipe;
  saved: boolean;
  moneySaved: string;
  backPressed: () => void;
}

function RecipeItem(props: Props) {
  const [showDetails, setShowDetails] = useState(false);
  function isValidValue(price: string) {
    const numberPrice = Number(price);
    if (numberPrice && numberPrice > 0 && numberPrice < 15) {
      return numberPrice;
    }
    return 0;
  }
  function getValueAverage(names: [string]) {
    var total = 0;
    var items = 0;
    for (const name of names) {
      for (const item of props.sales[name]) {
        var itemValue = '';

        itemValue = item.savings;

        if (isValidValue(itemValue) !== 0) {
          total += isValidValue(itemValue);
          items += 1;
        }
      }
    }
    if (items === 0) {
      return 0;
    }
    return total / items;
  }
  function calculateValue() {
    var totalValue = 0;
    var ingredients = props.recipes.usedIngredients;
    for (const ingredient of ingredients) {
      if (getValueAverage(ingredient.original) !== 0) {
        totalValue += getValueAverage(ingredient.original);
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

  const savings = calculateValue();
  const title = formatTitle();
  return (
    <TouchableOpacity style={styles.box} onPress={() => setShowDetails(true)}>
      <View style={styles.border}>
        <Image style={styles.image} source={{uri: props.recipes.image}} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.savings}>{'$' + savings}</Text>
      <RecipeDetails
        showDetails={showDetails}
        onRequestClose={() => {
          setShowDetails(false);
          props.backPressed();
        }}
        recipes={props.recipes}
        sales={props.sales}
        saved={props.saved}
        moneySaved={props.moneySaved}
      />
    </TouchableOpacity>
  );
}

const styles = {
  box: {
    margin: 10,
    marginRight: 35,
    marginLeft: 0,
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
  },
};

export default RecipeItem;
