import React, { useState, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './StackNavigation';

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigation/>
    </NavigationContainer>
  );
};
export default App;