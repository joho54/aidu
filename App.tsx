import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigations/tabNavigators';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
