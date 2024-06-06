import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, SafeAreaView, FlatList, View } from 'react-native'
import { ActivityIndicator, AnimatedFAB, Avatar, List, Text } from 'react-native-paper'

import Topbar from '../components/Topbar'
import useDB from '../Hooks/useDB'

const VegetationItem = ({id, classification, height, trunkDiameter = '-', cupDiameter = '-'}) => (
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
          <Text>{trunkDiameter} cm</Text>
          <List.Icon icon="tree" />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{cupDiameter} m</Text>
          <List.Icon icon="grass" />
        </View>
      </View>
    )}
    titleStyle={{fontSize: 24}}
  />
)

const VegetationListScreen = ({navigation}) => {
  const [isExtended, setIsExtended] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { getAllSpecimens, specimens, loading } = useDB();
  
  useEffect(() => {
    getAllSpecimens()
  }, [])

  const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsExtended(currentScrollPosition <= 0);
	};

  if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size={'large'} />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
      <Topbar 
        title='Lista de ejemplares'
        whitActions={
          [
            {
              icon: 'export-variant',
              onPress: () => { console.info('export data') },
            }
          ]
        }
      />
      <FlatList
        data={specimens}
        renderItem={({item}) => (
        <VegetationItem 
          id={item.id}
          classification={item.classification} 
          height={item.height}
          trunkDiameter={item.trunk_diameter}
          cupDiameter={item.cup_diameter}
        />)}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        refreshing={refreshing}
        onRefresh={getAllSpecimens}
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
  loadingContainer: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
		justifyContent: 'center',
		alignItems: 'center'
	},
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