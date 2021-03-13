import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, TouchableHighlight, TextInput } from 'react-native';
import _ from 'lodash'
import { Button } from 'react-native-paper'
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { getUserByOIB } from "../helper/user";

import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { theme } from '../assets/theme'

import QRCode from '../components/QRCode';

const TabOneScreen:FunctionComponent  = (props) => {
  // const [user, setUser] = useState({})
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false)
  const [oib, setOib] = useState('')
  const [hasPermission, setHasPermission] = useState(false);

  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // async function getUsers1 () {
    //   let response = await getUser(1)
    //   console.log('usersss',response)
    // }

    // getUsers1()
    console.log('first time Tab one',props)
  }, []);

  const handleWriteIdButton = () => {
    setModalVisible(true)
  }

  const handlePretraziKorisnika = async () => {
    console.log('pretraziii', oib)
    const data = await getUserByOIB(oib)
    if(_.isEmpty(data)){
      setErrorMsg(true)
    } else {
      // setUser(data)
      setModalVisible(false)
      setOib('')
      const navigation = _.get(props, 'navigation')
      navigation.navigate('Profile', {
        data: data
      })
    }
  }

  const handleCloseModal = () => {
    setModalVisible(!modalVisible);
    setErrorMsg(false)
    // setUser({})
    setOib('')
  }

  const handleBarCodeScanned = async({ type, data }) => {

    const userData = await getUserByOIB(data)
    if(_.isEmpty(userData)){
      console.log('nije ga nasloooo')
    } else {
    setScanned(true);
    const navigation = _.get(props, 'navigation')
    navigation.navigate('Profile', {
      data: userData
    })
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  }};

  const handleOpenQR = async() => {
    console.log('tuu smoooooo')
    setScanned(false)
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    console.log('status',status)
    const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (perm.status != 'granted') {
      return;
    }
    console.log('1===')
    setHasPermission(status === 'granted');


    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    console.log('2===')
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    console.log('3===')
  console.log('iza svega')
  }

  if(hasPermission && !scanned) {
    console.log('-----u kameri-----')
    return (
      <View style={styles.container}>
        {console.log('i tu',scanned )}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          // style={StyleSheet.absoluteFillObject}
          style={styles.camera}
        />
        {scanned && <Button  onPress={() => setScanned(false)} >Tap to Scan Again </Button>}
        {!scanned && <Button  onPress={() => setScanned(true)} > Close Scanned</Button>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Upisite OIB pacijenta (10 znakova)</Text>
            <TextInput
              style={{ backgroundColor: 'white', height: 40, borderColor: 'lightgray', borderWidth: 25 }}
              onChangeText={text => setOib(text)}
              value={oib}
            />
            <View style={styles.twoButtons}>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: oib.length !== 10 ? 'grey' : '#2196F3' }}
                onPress={handlePretraziKorisnika}
                disabled={oib.length !== 10}
              >
                <Text style={styles.textStyle}>Search</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={handleCloseModal}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
            {errorMsg && <Text style={styles.errorModalText}>User does not exist</Text>}
          </View>
        </View>
      </Modal>
      {/* botuni */}
      {/* <Button
        onPress={handleWriteIdButton}
        title="Upisi OIB"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
      <Text
        style={styles.text}
      >
        Welcome to QR-code medical App
        Please press the button if you want to scan medical QR-code
      </Text>
      <Button
        onPress={handleOpenQR}
        style={styles.button}
      >
        Scan QR code
      </Button>
      {/* <Text style={styles.title}>Tab aaaaaaaOne</Text> */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* <QRCode /> */}
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    width: 450,
    height: 600,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    margin: 10,
  },
  text:{
    width: 300,
    marginBottom: 50,
    fontFamily: 'Roboto',
    lineHeight: 30,
    // fontSize: 15,
  },
  twoButtons: {
    marginVertical: 30,
    flexDirection:"row"
  },
  button: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    margin: 10,
  },
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
  centeredView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  errorModalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'red',
  },
});

export default TabOneScreen