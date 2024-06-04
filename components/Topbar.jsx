import { Appbar } from 'react-native-paper';

const Topbar = (props) => {
	const {
		title,
		whitBackAction = false,
		onBack,
		whitActions
	} = props;
	
	return (
		<Appbar.Header elevated>
			{
				whitBackAction
					? <Appbar.BackAction onPress={onBack}/>
					: null
			}
			<Appbar.Content title={title}/>
			{
				whitActions
					? whitActions.map((action) => <Appbar.Action icon={action.icon} onPress={action.onPress}/>)
					: null
			}
		</Appbar.Header>
	);
};

export default Topbar;