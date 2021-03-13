import React, { useEffect, useContext, useState } from 'react';
import _ from 'lodash'
import { Card, Title, Paragraph, Portal, Button, Provider } from 'react-native-paper';
import { ScrollView, Modal, StyleSheet,TextInput, Dimensions, TouchableHighlight } from "react-native";

import moment from 'moment'
import { AppContext } from "../provider/AppContext";
import { Text, View } from './Themed';
import { saveReview } from '../helper/user'

import { theme } from '../assets/theme'


const Review = ({chartInfo, getAll }) => {
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const [chartId, setChartId] = useState(_.get(chartInfo, 'chart.id'))
  const [reviewResp, setReviewResp] = useState({})
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
      const reviewResp =  await saveReview(review, chartId)
      console.log('reviewResp=====',reviewResp)
      await getAll(_.get(chartInfo, 'chart.id'), _.get(chartInfo, 'id'))
      setVisible(false)
    } catch (error) {
      setError('Review was not saved, try again')
    }
  }

  return (
    <ScrollView>
      {console.log('chartInfo-----',chartInfo)}
      {_.get(user, 'title') === 'patient' && !_.get(chartInfo, 'chartReview.review') && _.get(chartInfo, 'chart.closed_at') && !_.get(reviewResp, 'review') &&
        <Button onPress={showModal}>
          Add Review
        </Button>
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        style={styles.modal}
      >
         <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>
    <View style={{
            width: 300,
            height: 300}}>

        <ScrollView >
          <View style={styles.modalView}>
          <Text>Add Review</Text>
            <TextInput
              style={styles.textInputStyle}
              value={review}
              numberOfLines={10}
              onChangeText={text => setReview(text)}
            />

          {/* {error && <Text>{error}</Text>} */}

          <View style={styles.buttons}>
             <Button
              onPress={handleSaveReview}
              style={styles.button}
              >
              Save
            </Button>
             <Button
              style={styles.button}
              onPress={closeModal}
            >
              Exit
            </Button>
          </View>


            {/* <View style={styles.twoButtons}>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={handleSaveReview}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Exit</Text>
              </TouchableHighlight>
            </View> */}
          </View>
        </ScrollView>

          </View>
        </View>
      </Modal>

      <Card>
        {_.get(chartInfo, 'chartReview.review') ?
        <Card.Content>
          <Paragraph>{moment(_.get(chartInfo, 'chartReview.created_at')).format('YYYY-MM-DD')}</Paragraph>
          <Paragraph>{_.get(chartInfo, 'fullName')}</Paragraph>
          <Paragraph>{_.get(reviewResp, 'review') || _.get(chartInfo, 'chartReview.review')}</Paragraph>
        </Card.Content> :
        <Card.Content>
          <Paragraph style={styles.centeredParagraph}>
            User didn't left Review
          </Paragraph>
        </Card.Content>
      }
      </Card>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  modal: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40,
  },
  centeredParagraph: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  centeredView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textInputStyle: {
    width: 250,
    height: 100,
    backgroundColor: 'lightgray',
    marginTop:30,
  },
  modalView: {
    width: 300,
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
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
  buttons: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    margin: 10,
  },
  openButton: {

    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
})

export default Review