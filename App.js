import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VegetationListScreen from './screens/VegetationListScreen';
import VegetationFormScreen from './screens/VegetationFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

