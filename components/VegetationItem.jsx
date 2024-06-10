import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Avatar, List, Text } from 'react-native-paper'

const VegetationItem = ({id, classification, height, trunkDiameter , cupDiameter }) => (
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
          trunkDiameter
            ? <View style={{flexDirection: 'row'}}>
                <Text>{trunkDiameter} cm</Text>
                <List.Icon icon="tree" />
              </View>
            : null
        }
        {
          cupDiameter
            ? <View style={{flexDirection: 'row'}}>
                <Text>{cupDiameter} m</Text>
                <List.Icon icon="grass" />
              </View>
            : null
        }
      </View>
    )}
    titleStyle={{fontSize: 24}}
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