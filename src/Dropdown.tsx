import {Ingredient, Sale, Sales} from './RecipeItem';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

//Dropdown menu for each ingredient on sale
export type DropdownChildren = [Ingredient];
export type TextChildren = [[Sale]];
interface Props {
  dropped: boolean;
  style: {};
  type: string;
  title: string;
  children: DropdownChildren | TextChildren;
  sales: Sales;
}

function Dropdown(props: Props) {
  const [dropped, setDropped] = useState(props.dropped);
  function makeItems(type: string) {
    if (!dropped) {
      return;
    }
    if (type === 'Text') {
      return (
        <View style={{paddingHorizontal: 15, paddingTop: 5}}>
          {(props.children as TextChildren).map(items => {
            return items.map(name => {
              var nameStore = name.store;
              return (
                <TouchableOpacity
                  style={{paddingTop: 15}}
                  onLongPress={() =>
                    Linking.openURL('https://www.flipp.com' + name.url)
                  }>
                  <Text style={{fontSize: 16}}>
                    {nameStore + ' - ' + name.item + ' - ' + name.price}
                  </Text>
                </TouchableOpacity>
              );
            });
          })}
        </View>
      );
    } else if (type === 'Dropdown') {
      return (
        <View style={{paddingLeft: 15, paddingTop: 5}}>
          {(props.children as DropdownChildren).map(item => {
            return (
              <Dropdown
                dropped={false}
                style={{fontSize: 20, paddingTop: 15}}
                title={
                  item.amount +
                  ' ' +
                  item.unit +
                  ' ' +
                  item.name[0].toUpperCase() +
                  item.name.substring(1)
                }
                type={'Text'}
                children={
                  item.original.map((name: string) => {
                    return props.sales[name];
                  }) as TextChildren
                }
                sales={{}}
              />
            );
          })}
        </View>
      );
    }
  }
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setDropped(!dropped);
        }}>
        <Text style={props.style}>
          {dropped ? props.title + ' ▾' : props.title + ' -'}
        </Text>
      </TouchableOpacity>
      {makeItems(props.type)}
    </>
  );
}

export default Dropdown;
