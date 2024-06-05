import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Topbar from '../components/Topbar'
import InputSelect from '../components/InputSelect'
import { Button, TextInput } from 'react-native-paper'

import usePlantIdGenerator from '../Hooks/usePlantIdGenerator'
import useDB from '../Hooks/useDB'

const VegetationFormScreen = ({navigation}) => {
	const { generatePlantId } = usePlantIdGenerator();
	const { createSpecimen } = useDB()

	const [specimen, setSpecimen] = useState({
		id: '',
		classification: '',
		height: '',
		trunkDiameter: '',
		cupDiameter: ''
	})

	const clearForm = () => {
		setSpecimen({
			id: '',
			classification: '',
			height: '',
			trunkDiameter: '',
			cupDiameter: ''
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
							value: 'suculenta/cactácea'
						},
						{
							label: 'Cactácea',
							value: 'suculenta/cactácea'
						},
					]}
					selectedValue={specimen.classification}
					onValueChange={(classification) => setSpecimen({
						...specimen,
						classification,
						id: generatePlantId(classification)
					})}
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
					label="Diámetro del tronco"
					value={specimen.trunkDiameter}
					onChangeText={trunkDiameter => setSpecimen({
						...specimen,
						trunkDiameter
					})}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro de la copa"
					value={specimen.cupDiameter}
					onChangeText={cupDiameter => setSpecimen({
						...specimen,
						cupDiameter
					})}
					keyboardType='numeric'
					/>

				<View style={styles.formControls}>
					<Button mode='outlined'>
						Terminar
					</Button>
					<Button mode='contained' onPress={handleSavePress}>
						Guardar elemento
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