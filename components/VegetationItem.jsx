import { View, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Avatar, Button, Icon, IconButton, List, MD3Colors, Modal, Portal, Text } from 'react-native-paper'
import useDB from '../Hooks/useDB'

const VegetationItem = ({id, classification, height, trunk_diameter, cup_diameter, onPress }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const { deleteSpecimenById } = useDB()

  return (
    <>
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
            {
              trunk_diameter
                ? <View style={{flexDirection: 'row'}}>
                    <Text>{trunk_diameter} cm</Text>
                    <List.Icon icon="tree" />
                  </View>
                : null
            }
            {
              cup_diameter
                ? <View style={{flexDirection: 'row'}}>
                    <Text>{cup_diameter} m</Text>
                    <List.Icon icon="grass" />
                  </View>
                : null
            }
          </View>
        )}
        titleStyle={{fontSize: 24}}
        onPress={onPress}
        right={() => <IconButton
          icon="delete"
          iconColor={MD3Colors.error50}
          size={30}
          onPress={showModal}
        />}
      />
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Icon
						source='delete'
						size={48}
						color={MD3Colors.error50}
					/>
					<Text variant='titleMedium'>¿Estas seguro que quieres borrar este espécimen?</Text>
					<View style={styles.modalControls}>
						<Button mode='outlined' onPress={hideModal}>Cancelar</Button>
						<Button mode='contained' buttonColor={MD3Colors.error50} onPress={() => deleteSpecimenById(id)}>Borrar</Button> 
					</View>
        </Modal>
      </Portal>
    </>
  )
}

export default VegetationItem

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8
  },
  itemDescription: {
    flexDirection: 'row',
    gap: 4
  },
  modal: {
		backgroundColor: '#F5F7FA',
		padding: 18,
		margin: 32,
		borderRadius: 12,
		gap: 16,
		alignItems: 'center'
	},
  modalControls: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		gap: 12,
		marginTop: 8
	},
})