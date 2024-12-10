// DrawerScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Button } from 'react-native';

const LogoutScreen = ({ onLogout }) => {

  const setAccessToken = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      console.log('Token removed successfully!');
    } catch (error) {
      console.error('Error saving token', error);
    }
  };

  const handleLogout = () => {
    // Logic to handle logout (e.g., clear session, redirect to login screen)
    setAccessToken();
    console.log('Logging out...');
    // Navigate to login screen or home after logout
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

export default LogoutScreen;
