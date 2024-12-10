import React, { useEffect, useState } from 'react';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import RecipeScreen from './src/components/RecipeScreen';
import LoginScreen from './src/components/LoginScreen';
import { ThemeProvider, useTheme } from './src/components/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LogoutScreen from './src/components/LogoutScreen';
import UserScreen from './src/components/UserScreen';
import { TokenProvider, useToken } from './src/state/TokenContext';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MyTabs() {
  const { token, login} = useToken();

  return (
    <Tab.Navigator>
      {(<Tab.Screen 
        name="Login" 
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <Image source={require('./src/assets/user-icon.jpg')} style={{width: 20, height: 20}} />
          ),
        }}>
        {() => <LoginScreen onLogin={login} />}
      </Tab.Screen>)}
      <Tab.Screen 
        name="Recipe"
        component={RecipeScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({}) => (
            <Image source={require('./src/assets/recipe.jpg')} style={{width: 40, height: 40}} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}


const MyDrawer = () => {
  const { token, logout } = useToken();
  
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={MyTabs} />
      <Drawer.Screen name="User" component={UserScreen} />
      {token && (
        <Drawer.Screen name="Logout">
          {() => <LogoutScreen onLogout={logout} />}
        </Drawer.Screen>
      )}
    </Drawer.Navigator>
  );
};

const App = () => {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TokenProvider>
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </TokenProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      marginBottom: 10,
    },
  });
  

export default App;

