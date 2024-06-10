import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, SafeAreaView, FlatList, View } from 'react-native'
import { ActivityIndicator, AnimatedFAB } from 'react-native-paper'
import { useStore } from 'zustand'

import Topbar from '../components/Topbar'
import VegetationItem from '../components/VegetationItem'
import useDB from '../Hooks/useDB'
import { useVegetationStore } from '../store/useVegetationStore'

const VegetationListScreen = ({navigation}) => {
  const [isExtended, setIsExtended] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { getAllSpecimens, loading } = useDB()
  const { specimens } = useStore(useVegetationStore)

  useEffect(() => {
    getAllSpecimens()
  }, [])

  const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0

		setIsExtended(currentScrollPosition <= 0)
	}

  if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size={'large'} />
			</View>
		)
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
          trunk_diameter={item.trunk_diameter}
          cup_diameter={item.cup_diameter}
          onPress={() => {navigation.navigate('VegetationDetail', {id: item.id})}}
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
  fabStyle: {
		bottom: 16,
		right: 16,
		position: 'absolute',
	},
})