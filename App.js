import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SQLiteProvider } from 'expo-sqlite'

import VegetationListScreen from './screens/VegetationListScreen'
import VegetationFormScreen from './screens/VegetationFormScreen'
import VegetationDetailScreen from './screens/VegetationDetailScreen'
import { PaperProvider } from 'react-native-paper'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SQLiteProvider databaseName='vegetation.db'>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="VegetationList" 
              component={VegetationListScreen} 
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name="VegetationForm" 
              component={VegetationFormScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name="VegetationDetail" 
              component={VegetationDetailScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SQLiteProvider>
  )
}

