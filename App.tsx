import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigations/tabNavigators';
import { openDatabase, createTables } from './src/services/databaseService';

export default function App() {
  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await openDatabase();
        await createTables(db);
        console.log('DB 초기화 완료');
      } catch (error) {
        console.error('DB 초기화 중 오류 발생:', error);
      }
    };

    initDB();
  }, []);
  
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
