import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { loginUser } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ onLogin }) => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const validateFields = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveAccessToken = async (token) => {
    onLogin(token);
  };

  const saveRefreshToken = async (token) => {
    try {
      await AsyncStorage.setItem('refresh_token', token);  // Save the token
      console.log('Refresh Token saved successfully!');
    } catch (error) {
      console.error('Error saving token', error);
    }
  };

  const handleLogin = async () => {
    if (validateFields()) {
      try{
        let data = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            
            username: username,
            password: password,
            expiresInMins: 30, // optional, defaults to 60
          }),
          credentials: 'include' // Include cookies (e.g., accessToken) in the request
        })
        .then(res => res.json())
        .then((responseJson) => {
          return responseJson;
        });        
        
        if(data.accessToken != undefined) {
          setLoginError('');
          saveAccessToken(data.accessToken);
          saveRefreshToken(data.refreshToken);
          Alert.alert('Success', 'Logged in successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('Recipe') },
          ]);
        } else {
          setLoginError(data.message);
        }
        
      } catch(error) {
        console.log('---error---', error);
      } 
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <Text style={[styles.title, { color: '#000' }]}>Login</Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: '#F0F0F0', color: '#000' },
        ]}
        placeholder="Username"
        placeholderTextColor={'#555555'}
        value={username}
        onChangeText={setUsername}
      />
      {errors.username ? (
        <Text style={styles.error}>{errors.username}</Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          { backgroundColor: '#F0F0F0', color: '#000' },
        ]}
        placeholder="Password"
        placeholderTextColor={'#555555'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}

      {loginError != '' ? (
        <Text style={styles.error}>{loginError}</Text>
      ) : null}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    height: 60,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    borderColor: '#9E9E9E',
    backgroundColor: '#9E9E9E'
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default LoginScreen;