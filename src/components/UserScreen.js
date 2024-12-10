// UserScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';

const UserScreen = ({ navigation }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        getAccessToken();
    }, [navigation]);

    const getAccessToken = async () => {
        const token = await AsyncStorage.getItem('access_token');

        let user = await fetch('https://dummyjson.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass JWT via Authorization header
          }, 
          credentials: 'include' // Include cookies (e.g., accessToken) in the request
        })
        .then(res => res.json())
        .then((responseJson) => {
            return responseJson;
        });
        
        let userData = {};
        userData.image = user.image;
        userData.firstName = user.firstName;
        userData.lastName = user.lastName;
        userData.username = user.username;
        userData.email = user.email;
        userData.gender = user.gender;
        setUser(userData);
        
    };

    const refreshToken = async () => {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        
        if (refreshToken != null) {
            let data = await fetch('https://dummyjson.com/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  refreshToken: refreshToken, // Optional, if not provided, the server will use the cookie
                  expiresInMins: 30, // optional (FOR ACCESS TOKEN), defaults to 60 
                }),
                credentials: 'include' // Include cookies (e.g., accessToken) in the request
              })
              .then(res => res.json())
              .then((responseJson) => {
                return responseJson;
            });
            
            await AsyncStorage.setItem('access_token', data.accessToken);
            await AsyncStorage.setItem('refresh_token', data.refreshToken);
        } else {
            Alert.alert('Alert', 'Login First', [
                {text: 'OK', onPress: () => {}}
            ])
        }
          
    }


  return (
    <>
    {user.firstName != undefined ? (
        <View style={styles.container}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        {user.username != undefined ? (<Text style={styles.detail}>Username: {user.username}</Text>) : (null)}
        {user.email != undefined ? (<Text style={styles.detail}>Email: {user.email}</Text>) : (null) }
        {user.gender != undefined ? (<Text style={styles.detail}>Gender: {user.gender}</Text>) : (null) }
        {user.firstName != undefined ? (<View>
          <Button
              title='Refresh Token'
              onPress={() => refreshToken()}
          />
        </View>) : (null)}
      </View>
    ) : (<View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold', marginTop: 20}}>LOGIN FIRST</Text>
    </View>)}
    </>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
},
profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 20,
},
name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
},
detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
},
});

export default UserScreen;
