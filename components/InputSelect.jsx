import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';

const InputSelect = ( props ) => {
	const {
		label,
		options,
		onValueChange,
		selectedValue
	} = props

	return (
		<View style={styles.inputSelect}>
			<Text variant='bodyLarge'>{label}</Text>
			<Picker
				selectedValue={selectedValue}
				onValueChange={onValueChange}
				style={styles.picker}
				mode='dropdown'
			>
				{
					options.map((option, index) => <Picker.Item key={index} label={option.label} value={option.value} style={styles.pickerOption}/>)
				}
			</Picker>
		</View>
	)
}

export default InputSelect

const styles = StyleSheet.create({
	inputSelect: {
		flexDirection: 'column'
	},
	picker: {
		backgroundColor: '#e9dfeb',
	},
	pickerOption: {
		backgroundColor: '#e9dfeb',
	}
})