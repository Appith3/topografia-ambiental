import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, SafeAreaView, FlatList, View } from 'react-native'
import { ActivityIndicator, AnimatedFAB, Text } from 'react-native-paper'
import { useStore } from 'zustand'

import Topbar from '../components/Topbar'
import VegetationItem from '../components/VegetationItem'
import useDB from '../Hooks/useDB'
import { useVegetationStore } from '../store/useVegetationStore'

const VegetationListScreen = ({navigation}) => {
  const [isExtended, setIsExtended] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { 
    getAllSpecimens, 
    loading 
  } = useDB()
  const { specimens } = useStore(useVegetationStore)

  useEffect(() => {
    getAllSpecimens()
  }, [])

  const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0

		setIsExtended(currentScrollPosition <= 0)
	}

  const downloadFile = async () => {
    setIsLoading(true);
    console.log('DOWNLOAD')
		let apiUrl = `https://api-libreta-topografica.onrender.com/api/download-vegetation-file/`;

		try {
			const result = await FileSystem.downloadAsync(
				apiUrl,
				`${FileSystem.documentDirectory}/vegetacion.xlsx`
			);
				
			if (result.status !== 200) {
				setIsLoading(false);
				return;
			} else {
				saveFile(result.uri);
			}
		} catch (error) {
			setIsLoading(false);
		}
  }

  const handlerPressExportFile = async () => {
    setIsLoading(true);
    console.log('specimens: ', specimens);
  
    try {
      const createResponse = await fetch(`https://api-libreta-topografica.onrender.com/api/create-vegetation-file`, {
        method: 'POST',
        body: specimens,
      });
  
      if (!createResponse.ok) {
        console.error('Error creating file:', createResponse.statusText);
        setIsLoading(false);
        return; // Exit if file creation fails
      }
  
      await downloadFile(); // Download the created file
    } catch (error) {
      console.error('Error exporting file:', error);
      setIsLoading(false);
    }
  };
  

  const renderItem = ({item}) => (
    <VegetationItem 
      id={item.id}
      classification={item.classification} 
      height={item.height}
      trunk_diameter={item.trunk_diameter}
      cup_diameter={item.cup_diameter}
      onPress={() => {navigation.navigate('VegetationDetail', {id: item.id})}}
    />
  )

  const emptyState = () => (
    <Text 
      variant='displaySmall'
      style={{
        textAlign: 'center', 
        alignSelf:'center'
      }}
    >
      No hay ejemplares que mostrar
    </Text>
  )

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
              onPress: () => { handlerPressExportFile() },
            }
          ]
        }
      />
      <FlatList
        data={specimens}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        refreshing={refreshing}
        onRefresh={getAllSpecimens}
        ListEmptyComponent={emptyState}
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