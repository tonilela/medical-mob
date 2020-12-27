import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, TouchableHighlight, Button, TextInput } from 'react-native';
import _ from 'lodash'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { getUserByOIB } from "../helper/user";

const TabOneScreen:FunctionComponent  = (props) => {
  // const [user, setUser] = useState({})
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false)
  const [oib, setOib] = useState('')

  // useEffect(() => {
  //   // async function getUsers1 () {
  //   //   let response = await getUser(1)
  //   //   console.log('usersss',response)
  //   // }
    
  //   // getUsers1()
  //   console.log(props)
  // }, []);

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
                <Text style={styles.textStyle}>Pretrazi</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={handleCloseModal}
              >
                <Text style={styles.textStyle}>Zatvori</Text>
              </TouchableHighlight>
            </View>
            {errorMsg && <Text style={styles.errorModalText}>Korisnik ne postoji</Text>}
          </View>
        </View>
      </Modal>
      {/* botuni */}
      <Button
        onPress={handleWriteIdButton}
        title="Upisi OIB"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Text style={styles.title}>Tab aaaaaaaOne</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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