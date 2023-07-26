import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';
import Map from './Map';

const Stack = createNativeStackNavigator();

const StackNavigation = () =>{
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Map" component={Map} />
          </Stack.Group>
        </Stack.Navigator>
      );
};
export default StackNavigation;