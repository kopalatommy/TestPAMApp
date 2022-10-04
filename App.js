import React from 'react';
import type { Node } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/reduxLogic/stateStore';
import { BluetoothScanner } from './src/Managers/BluetoothManager';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { initializeBLE } from './src/Managers/BluetoothManager';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { pages_obj_references } from './src/Pages/navUtils';

const Stack = createNativeStackNavigator();

initializeBLE(store.dispatch);

const App: () => Node = () => {

  // Used to verify that the app has the proper permissions and will request them if not found
  const checkPermissions = async () => {
    // Holds the keys for the permissions to verify/request
    let permissions = [];
    // Permissions are platform dependent
    if (Platform.OS == 'ios') {
      permissions = [PERMISSIONS.IOS.BLUETOOTH_CONNECT, PERMISSIONS.IOS.BLUETOOTH_SCAN, PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL, PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE, PERMISSIONS.IOS.READ_EXTERNAL_STORAGE];
    } else if (Platform.OS == 'android') {
      permissions = [PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION];
    }

    //console.log('Requesting: ', permissions);

    // Get the statuses of the permissions
    let statuses = await requestMultiple(permissions)
      .then(() => console.log('Finished checking permissions'))
      .catch((err) => console.log('Failed to check permissions: ', err));
  };

  checkPermissions();

  return (
    <Provider store={store}>
      <BluetoothScanner />
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerShown: false,
            }}>
              {
                Object.keys(pages_obj_references).map((key) => {
                  return (
                    <Stack.Screen key={key} name={key} component={pages_obj_references[key]} />
                  );
                })
              }
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
