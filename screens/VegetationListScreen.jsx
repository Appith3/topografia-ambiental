import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, SafeAreaView, FlatList, View } from 'react-native'
import { AnimatedFAB, Avatar, List, Text } from 'react-native-paper'
import Topbar from '../components/Topbar'

const data = [
  {
    "id": "A-01",
    "classification": "árbol",
    "height": "10",
    "trunk_diameter": "2",
    "cup_diameter": "5"
  },
  {
    "id": "B-01",
    "classification": "arbusto",
    "height": "3",
    "cup_diameter": "1"
  },
  {
    "id": "P-01",
    "classification": "palma",
    "height": "8",
    "trunk_diameter": "1.5",
    "cup_diameter": "4"
  },
  {
    "id": "S-01",
    "classification": "suculenta",
    "height": "0.5"
  },
  {
    "id": "S-02",
    "classification": "cactácea",
    "height": "0.8"
  },
  {
    "id": "A-02",
    "classification": "árbol",
    "height": "12",
    "trunk_diameter": "3.5",
    "cup_diameter": "7"
  },
  {
    "id": "B-02",
    "classification": "arbusto",
    "height": "4",
    "cup_diameter": "1.5"
  },
  {
    "id": "P-02",
    "classification": "palma",
    "height": "7",
    "trunk_diameter": "1",
    "cup_diameter": "3"
  },
  {
    "id": "S-03",
    "classification": "suculenta",
    "height": "0.3"
  },
  {
    "id": "S-04",
    "classification": "cactácea",
    "height": "1.2"
  }
]

const VegetationItem = ({id, classification, height, trunk_diameter = '-', cup_diameter = '-'}) => (
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
        <View style={{flexDirection: 'row'}}>
          <Text>{trunk_diameter} cm</Text>
          <List.Icon icon="tree" />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{cup_diameter} m</Text>
          <List.Icon icon="grass" />
        </View>
      </View>
    )}
    titleStyle={{fontSize: 24}}
  />
)

const VegetationListScreen = ({navigation}) => {
  const [isExtended, setIsExtended] = useState(true);

  const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsExtended(currentScrollPosition <= 0);
	};

	return (
		<SafeAreaView style={styles.container}>
      <Topbar 
        title='Lista de ejemplares'
        whitActions={
          [
            {
              icon: 'export-variant',
              onPress: () => { console.log('export data') },
            }
          ]
        }
      />
      <FlatList
        data={data}
        renderItem={({item}) => (
        <VegetationItem 
          id={item.id}
          classification={item.classification} 
          height={item.height}
          trunk_diameter={item.trunk_diameter}
          cup_diameter={item.cup_diameter}
        />)}
        keyExtractor={item => item.id}
        onScroll={onScroll}
      />
      <AnimatedFAB
					icon={'plus'}
					label={'Agregar ejemplar'}
					extended={isExtended}
					onPress={() => navigation.navigate('VegetationForm')}
					animateFrom={'right'}
					iconMode={'dynamic'}
					style={styles.fabStyle}
				/>
		</SafeAreaView>
	)
}

export default VegetationListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8
  },
  itemDescription: {
    flexDirection: 'row',
    gap: 18
  },
  fabStyle: {
		bottom: 16,
		right: 16,
		position: 'absolute',
	},
})