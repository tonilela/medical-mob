import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getUserByOIB } from '../helper/user';

export default function QRCode() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

 

  const handleBarCodeScanned = async ({ type, data }) => {
    const userData = await getUserByOIB(data)
    console.log('userdata----',userData)
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <Button title={'Tap to Scan Again'} onPress={()=>console.log('hiii')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  twoButtons: {
    marginVertical: 30,
    flexDirection:"row"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})