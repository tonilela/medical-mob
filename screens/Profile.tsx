import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, TouchableHighlight, Button, TextInput } from 'react-native';
import _ from 'lodash'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { getUserByOIB } from "../helper/user";


export default function Profile(props) {
  useEffect(() => {
    console.log('profileeeee',props)

  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
