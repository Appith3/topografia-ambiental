import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Snackbar, Text, TextInput } from 'react-native-paper'

import Topbar from '../components/Topbar'
import InputSelect from '../components/InputSelect'
import useDB from '../Hooks/useDB'

const VegetationDetailScreen = ( props ) => {

	const {
		navigation,
		route
	} = props

	const { id } = route.params

	const {
		getSpecimenById,
		updateSpecimenClassification,
		updateSpecimenHeight,
		updateSpecimenTrunkDiameter,
		updateSpecimenCupDiameter
	} = useDB()

	const [specimen, setSpecimen] = useState({
		classification: '',
		height: '',
		trunk_diameter: '',
		cup_diameter: ''
	})

	const [visible, setVisible] = React.useState(false)

  const onToggleSnackBar = () => setVisible(!visible)

  const onDismissSnackBar = () => setVisible(false)

	const loadSpecimen = async (specimenId) => {
    const fetchedSpecimen = await getSpecimenById(specimenId)
    setSpecimen(fetchedSpecimen)
  }

	const handleEditPress = async () => {
    await updateSpecimenClassification(id, specimen.classification)
    await updateSpecimenHeight(id, parseFloat(specimen.height)) 
    if (specimen.trunk_diameter !== '') { 
      await updateSpecimenTrunkDiameter(id, parseFloat(specimen.trunk_diameter))
    }
    if (specimen.cup_diameter !== '') {
      await updateSpecimenCupDiameter(id, parseFloat(specimen.cup_diameter))
    }

		onToggleSnackBar()
  }

	useEffect(() => {
		loadSpecimen(id)
	}, [])

	return (
		<View style={styles.container}>
			<Topbar title={`Editar ejemplar ${id}`} whitBackAction onBack={() => {navigation.goBack()}}/>
			<View style={styles.form}>
				<InputSelect 
					options={[
						{
							label: 'Selecciona una clasificación',
							value: 'default'
						},
						{
							label: 'Árbol',
							value: 'árbol'
						},
						{
							label: 'Arbusto',
							value: 'arbusto'
						},
						{
							label: 'Palma',
							value: 'palma'
						},
						{
							label: 'Suculenta',
							value: 'suculenta'
						},
						{
							label: 'Cactácea',
							value: 'cactácea'
						},
					]}
					selectedValue={specimen.classification}
					onValueChange={(classification) => {
						setSpecimen({
							...specimen,
							classification,
						})
					}}
				/>
				<TextInput
					label="Altura"
					value={specimen.height?.toString()}
					onChangeText={height => setSpecimen({
						...specimen,
						height
					})}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro de la copa"
					value={specimen.cup_diameter?.toString()}
					onChangeText={cup_diameter => setSpecimen({
						...specimen,
						cup_diameter
					})}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro del tronco"
					value={specimen.trunk_diameter?.toString()}
					onChangeText={trunk_diameter => setSpecimen({
						...specimen,
						trunk_diameter
					})}
					keyboardType='numeric'
				/>

				<View style={styles.formControls}>
					<Button mode='contained' onPress={handleEditPress}>
						Editar ejemplar
					</Button>
				</View>
			</View>
			<Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'cerrar',
          onPress: () => {onToggleSnackBar()},
        }}>
					<Text style={{color: "#FAFAFA"}}>Ejemplar {id} actualizado</Text>
      </Snackbar>
		</View>
	)
}

export default VegetationDetailScreen

const styles = StyleSheet.create({
	container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
	form: {
		flex: 1,
		justifyContent: 'center',
		margin: 16,
		gap: 18,
	},
	formControls: {
		marginTop: 42,
		gap: 20,
	}
})