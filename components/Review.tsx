import React, { useEffect, useContext, useState } from 'react';
import _ from 'lodash'
import { Card, Title, Paragraph, Portal, Button, Provider } from 'react-native-paper';
import { ScrollView, Modal, StyleSheet,TextInput, Dimensions, TouchableHighlight } from "react-native";

import moment from 'moment'
import { AppContext } from "../provider/AppContext";
import { Text, View } from './Themed';
import { saveReview } from '../helper/user'


const Review = ({chartInfo}) => {
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const [chartId, setChartId] = useState(_.get(chartInfo, 'chart.id'))
  const showModal = () => setVisible(true);
  const closeModal = () => {
    setVisible(false);
  
  }
  
  useEffect(()=>{
    console.log('chartInfo',chartInfo)
  }, [])

  const { user } = useContext(AppContext);
  
  const handleSaveReview  = async() => {
    setError('')
    console.log('handleSaveReview0-------')
    try {
      await saveReview(review, chartId)
      setVisible(false)
    } catch (error) {
      setError('Review nije spremljen, pokusajte ponovno')
    }
  }

  return (
    <ScrollView>
      {_.get(user, 'title') === 'patient' && 
        <Button onPress={showModal}>
          Novi Unos
        </Button>
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
        <ScrollView >
          <View style={styles.modalView}>
          <Text>Ostavite komentar na lijecenje</Text>
          <Text>Info</Text>
            <TextInput
              style={styles.textInputStyle}
              value={review}
              numberOfLines={10}
              onChangeText={text => setReview(text)}
            />

          {/* {error && <Text>{error}</Text>} */}

          <View style={styles.twoButtons}>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={handleSaveReview}
              >
                <Text style={styles.textStyle}>Spremi</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Odustani</Text>
              </TouchableHighlight>
            </View> 
          </View>
        </ScrollView>
      </Modal>

      <Card>
        <Card.Content>
          <Paragraph>{moment(_.get(chartInfo, 'chartReview.created_at')).format('YYYY-MM-DD')}</Paragraph>
          <Paragraph>{_.get(chartInfo, 'fullName')}</Paragraph>
          <Paragraph>{_.get(chartInfo, 'chartReview.review')}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textInputStyle: {
    width: 150,
    height: 40,
    backgroundColor: 'lightgray',
    marginTop:30,
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  twoButtons: {
    marginVertical: 30,
    flexDirection:"row"
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
})

export default Review