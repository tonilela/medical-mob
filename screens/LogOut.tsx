import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useContext } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import { Text, Button } from 'react-native-paper'
import _ from 'lodash'

import { AppContext } from '../provider/AppContext'

import { theme } from '../assets/theme'

export default function LogOut({navigation}) {
  const {setUser} = useContext(AppContext)

  const handleLogout = () => {
    console.log('logousst')
    setUser(undefined)
    navigation.navigate('Login')
    // navigation.replace('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To logout press the button below</Text>
      <Button
        onPress={handleLogout}
        style={styles.button}
      >
        <Text>Logout</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  button: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    margin: 10,
  },
});
