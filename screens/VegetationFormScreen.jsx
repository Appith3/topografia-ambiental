import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, TextInput } from 'react-native-paper'

import Topbar from '../components/Topbar'
import InputSelect from '../components/InputSelect'

//// import usePlantIdGenerator from '../Hooks/usePlantIdGenerator'
import useDB from '../Hooks/useDB'

const VegetationFormScreen = ({navigation}) => {
	//// const { generatePlantId } = usePlantIdGenerator()
	const { createSpecimen } = useDB()

	const [specimen, setSpecimen] = useState({
		id: '',
		classification: '',
		height: '',
		trunk_diameter: '',
		cup_diameter: ''
	})

	const clearForm = () => {
		setSpecimen({
			id: '',
			classification: '',
			height: '',
			trunk_diameter: '',
			cup_diameter: ''
		})
	}

	const handleSavePress = () => {
		createSpecimen(specimen)
		clearForm()
	}

	return (
		<View style={styles.container}>
			<Topbar title='Agregar ejemplar' whitBackAction onBack={() => {navigation.goBack()}}/>
			<View style={styles.form}>
				<TextInput
					label="ID de colectora"
					value={specimen.id}
					onChangeText={id => setSpecimen({
						...specimen,
						id
					})}
					keyboardType='numeric'
				/>
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
						//// let id = generatePlantId(classification)
						setSpecimen({
							...specimen,
							classification,
							//// id: id._j
						})
					}}
				/>
				<TextInput
					label="Altura"
					value={specimen.height}
					onChangeText={height => setSpecimen({
						...specimen,
						height
					})}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro de la copa"
					value={specimen.cup_diameter}
					onChangeText={cup_diameter => setSpecimen({
						...specimen,
						cup_diameter
					})}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro del tronco"
					value={specimen.trunk_diameter}
					onChangeText={trunk_diameter => setSpecimen({
						...specimen,
						trunk_diameter
					})}
					keyboardType='numeric'
				/>

				<View style={styles.formControls}>
					<Button mode='contained' onPress={handleSavePress}>
						Guardar ejemplar
					</Button>
				</View>
			</View>
		</View>
	)
}

export default VegetationFormScreen

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