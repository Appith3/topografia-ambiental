import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Topbar from '../components/Topbar'
import InputSelect from '../components/InputSelect'
import { Button, TextInput } from 'react-native-paper'

const VegetationFormScreen = ({navigation}) => {
	const [selectedClassification, setSelectedClassification] = useState()
	const [height, setHeight] = useState("");
	const [trunkDiameter, setTrunkDiameter] = useState("");
	const [cupDiameter, setCupDiameter] = useState("");

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
							value: 'suculenta'
						},
						{
							label: 'Cactácea',
							value: 'cactácea'
						},
					]}
					selectedValue={selectedClassification}
					onValueChange={(itemValue) => setSelectedClassification(itemValue)}
				/>
				<TextInput
					label="Altura"
					value={height}
					onChangeText={height => setHeight(height)}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro del tronco"
					value={trunkDiameter}
					onChangeText={trunkDiameter => setTrunkDiameter(trunkDiameter)}
					keyboardType='numeric'
				/>
				<TextInput
					label="Diámetro de la copa"
					value={cupDiameter}
					onChangeText={cupDiameter => setCupDiameter(cupDiameter)}
					keyboardType='numeric'
					/>

				<View style={styles.formControls}>
					<Button mode='outlined'>
						Terminar
					</Button>
					<Button mode='contained'>
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