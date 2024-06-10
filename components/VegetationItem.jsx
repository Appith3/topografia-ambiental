import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Avatar, List, Text } from 'react-native-paper'

const VegetationItem = ({id, classification, height, trunk_diameter , cup_diameter, onPress }) => (
  <List.Item
    left={() => <Avatar.Text label={id} labelStyle={{fontSize: 18}}/>}
    style={styles.item}
    title={classification}
    description={() => (
      <View style={styles.itemDescription}>
        <View style={{flexDirection: 'row'}}>
          <Text>{height} m</Text>
          <List.Icon icon="ruler" />
        </View>
        {
          trunk_diameter
            ? <View style={{flexDirection: 'row'}}>
                <Text>{trunk_diameter} cm</Text>
                <List.Icon icon="tree" />
              </View>
            : null
        }
        {
          cup_diameter
            ? <View style={{flexDirection: 'row'}}>
                <Text>{cup_diameter} m</Text>
                <List.Icon icon="grass" />
              </View>
            : null
        }
      </View>
    )}
    titleStyle={{fontSize: 24}}
    onPress={onPress}
  />
)

export default VegetationItem

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8
  },
  itemDescription: {
    flexDirection: 'row',
    gap: 4
  },
})