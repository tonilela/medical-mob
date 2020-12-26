import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Alert,ScrollView,Platform, Image, ImageBackground, Modal, StyleSheet, TouchableHighlight, Button, TextInput } from 'react-native';
import _ from 'lodash'
import moment from 'moment'
import { Card, Icon } from 'react-native-elements'

import Table from '../components/Table'
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Separator from '../components/Separator'
import background from '../assets/images/background.jpg'
// import { getAllUserData } from "../helper/user";


export default function Profile(props) {
  const [user, setUser] = useState({});
  const [chart, setChart] = useState({});
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const {charts, user} = _.get(props, 'route.params.data')
    setUser(user)
    setChart(charts)
    setLoading(false)
  }, []);

  const handlePress = (id, patient_id) => {
    console.log('tu smo batice-------',id)
    const navigation = _.get(props, 'navigation')
      navigation.navigate('Chart', {
        id: id,
        patient_id: patient_id
      })
  }

  const renderProfile = () => {
    const {
      createdAt,
      dateOfBirth,
      email,
      fullName,
      id,
      oib,
      picture,
      sex,
      title
    } = user

    return (
      <View>
        {/* <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{
            uri: background,
          }}
        > */}
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={{
                uri: `https://medial-api.s3.eu-central-1.amazonaws.com/profile/${picture ? picture: 'default.png'}`,
              }}
            />
            <Text style={styles.userNameText}>{fullName}</Text>
            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name="place"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                />
              </View>
              <View style={styles.userDataRow}>
                <View style={styles.viewRow}>
                  <Text style={styles.title}>
                    Ime:
                  </Text>
                  <Text style={styles.userData}>
                    {fullName}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.title}>
                    Datum rodenja:
                  </Text>
                  <Text style={styles.userData}>  
                    {moment(dateOfBirth).format('YYYY-MM-DD')}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.title}>
                    email:s
                  </Text>
                  <Text style={styles.userData}>
                    {email}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.title}>
                    Oib:
                  </Text>
                  <Text style={styles.userData}>
                    {oib}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.title}>
                    Spol:
                  </Text>
                  <Text style={styles.userData}>
                    {sex}
                  </Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.title}>
                    Titula:
                  </Text>
                  <Text style={styles.userData}>
                    {title}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        {/* </ImageBackground> */}
      </View>
    )
  }

  if(loading){
    return(
      <View>
        <Text> loadingggg</Text>
      </View>
    )
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      {/* <Card containerStyle={styles.cardContainer}> */}
        {renderProfile()}
        {Separator()}
        {<Table 
          handlePress={handlePress}
          charts={chart}
        />}
      {/* </Card> */}
    </View>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDataRow: {
    backgroundColor: 'transparent',
  },
  viewRow: {
    marginBottom: 22,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userImage: {
    borderColor: '#01C89E',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 35,
  },
  userData: {
    color: '#A5A5A5',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },  
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
});
