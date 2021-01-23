import  React, { useState, useEffect } from 'react';
import { DataTable, Card, Title, Paragraph, Portal, Button, Provider } from 'react-native-paper';
import _ from 'lodash'
import moment from 'moment'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit'
import {MaterialIcons} from '@expo/vector-icons';
import { ScrollView, Modal, StyleSheet,TextInput, Dimensions, TouchableHighlight } from "react-native";
// import { Multiselect } from 'multiselect-react-dropdown';
import { createNewChartInfo } from '../helper/user'
import SelectMultiple from 'react-native-select-multiple'

import { Text, View } from '../components/Themed';

import Separator from '../components/Separator'

import SectionedMultiSelect from 'react-native-sectioned-multi-select';


const Vizita = ({users, chartInfo, diseases, medicaments, getAll}) => {
  const [visible, setVisible] = useState(false);

  const [ newInfo, setInfo] = useState('')
  const [temperature, setTemperature] = useState('')
  const [selectedDisease, setSelectedDisease] = useState([])
  const [selectedMedicaments, setSelectedMedicaments] = useState([])
  const [temperatureArray, setTemperatureArray] = useState<number[]>([])
  const [dateArray, setDateArray] = useState<string[]>([])

  const showModal = () => setVisible(true);

  const hideModal = () => { 
    setSelectedMedicaments([])
    setSelectedDisease([])
    setTemperature('')
    setInfo('')
    setVisible(false);
  }
  
  const setGraph = (data) => {
    _.each(data, c => {
      const { created_at } = c
      const date = `${moment(created_at).format('YYYY-MM-DD')}`
      setDateArray([...dateArray, date])
    })
    // const created_at1 = moment(created_at).format('YYYY-MM-DD')
    // console.log(temp1)
    // setTemperatureArray(temperatureArray.concat(temp1))
    // setDateArray([...dateArray,...temp2])
   
  }

  useEffect(() => {
    // console.log(chartInfo.chartInfo)
    // const temp1 = _.map(chartInfo.chartInfo, c => {
    //   const { temperature } = c
    //   console.log(temperature)
    //   return parseFloat(temperature)
    // })
    const dates = _.map(chartInfo.chartInfo, c => {
      const { created_at } = c
      return `${moment(created_at).format('MM-DD')}`
    })
    const temp = _.map(_.reverse(chartInfo.chartInfo), c => {
      const { temperature } = c
      return parseFloat(temperature)
    })
    setDateArray(_.reverse(dates))
    setTemperatureArray(temp)
    // console.log('temperastuare=====',temperatureArray)
    // return () => {
    //   setTemperatureArray([])
    //   setDateArray([])
    // }
  }, []);

  if(_.isEmpty(users)|| _.isEmpty(chartInfo) || _.isEmpty(medicaments) || _.isEmpty(diseases)) {
    return (
      <View>
        <Text> loadingggg</Text>
      </View>
    )
  } 

  const {
    lastMedicament, 
    lastDisease,
    chartInfo: info
  } = chartInfo

  const lastDiseasesMap = _.map(lastDisease, d => 
    _.get(
      _.filter(diseases, v => d === v.id), 
        '[0].name'
      )
  )
  
  const lastMedicamentsMap = _.map(lastMedicament, d => 
    _.get(
      _.filter(medicaments, v => d === v.id), 
        '[0].name'
      )
  )
  
  const handleStvoriNovi = async() => {
    const {chart: {id: chartId}} = chartInfo
    const {id: userId} = chartInfo

    const data = {
      disease: selectedDisease,
      medicaments: selectedMedicaments,
      info: newInfo,
      temperature: temperature
    }

    await createNewChartInfo(userId, chartId, data)
    await getAll(chartId, userId)
    hideModal()
  }

  const handleSelectDisease = (e) => {
    setSelectedDisease(e)
  }

  const handleSelectMedicaments = (e) => {
    setSelectedMedicaments(e)
  }

  return (
    <ScrollView>
           <Button onPress={showModal}>
             Novi Unos
           </Button>

        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
         >
        <ScrollView >
          <View style={styles.modalView}>
          <Text>Dodaj novu dijagnozu na karton</Text>
          <Text>Info</Text>
            <TextInput
              style={styles.textInputStyle}
              value={newInfo}
              numberOfLines={4}
              onChangeText={text => setInfo(text)}
            />
            <Text>Temperatura</Text>
            <TextInput
              style={styles.textInputStyle}
              value={temperature}
              onChangeText={text => setTemperature(text)}
            />
            
            <Text>Bolesti</Text>
            <SectionedMultiSelect
              items={diseases}
              IconRenderer={MaterialIcons}
              uniqueKey="id"
              subKey="children"
              selectText="Odaberi bolesti"
              showDropDowns={true}
              // readOnlyHeadings={true}
              onSelectedItemsChange={(e)=>handleSelectDisease(e)}
              selectedItems={selectedDisease}
            />

            <Text>Ljekovi</Text>
            <SectionedMultiSelect
              items={medicaments}
              IconRenderer={MaterialIcons}
              uniqueKey="id"
              subKey="children"
              selectText="Odaberi ljekove"
              showDropDowns={true}
              // readOnlyHeadings={true}
              onSelectedItemsChange={(e)=>handleSelectMedicaments(e)}
              selectedItems={selectedMedicaments}
            />
          <View style={styles.twoButtons}>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={handleStvoriNovi}
              >
                <Text style={styles.textStyle}>Spremi</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={hideModal}
              >
                <Text style={styles.textStyle}>Odustani</Text>
              </TouchableHighlight>
            </View> 
          </View>
        </ScrollView>
      </Modal>


      {!visible && <Card>
        <Card.Content>
          <Title>Trenutna Diagnoza:</Title>
          <Paragraph>Trenutne Bolesti</Paragraph>
            {!_.isEmpty(lastDisease) 
            ? _.map(lastDiseasesMap, (d,i) => <Paragraph key={i}>- {d}</Paragraph>)
            : <Paragraph>Nema utvrdenih Bolesti</Paragraph>}
          <Paragraph>Trenutni Ljekovi</Paragraph>
            {!_.isEmpty(lastMedicament) 
            ? _.map(lastMedicamentsMap, (d, i) => <Paragraph key={i}>- {d}</Paragraph>)
            : <Paragraph>Nema pripisanih ljekova</Paragraph>}
        </Card.Content>
        <Separator/>

        {!_.isEmpty(temperatureArray) && !_.isEmpty(dateArray) && <View>
          <Text>
            Temperatura za period {_.last(dateArray)} - {_.first(dateArray)}
          </Text>
          <ScrollView
            horizontal={true}
            >
          <LineChart
            data={{
              labels: dateArray,
              datasets: [{
                data: temperatureArray,
              }]
            }}
            width={_.size(temperatureArray) > 5 ? Dimensions.get('window').width + ((_.size(temperatureArray)-5) * 72): Dimensions.get('window').width} // from react-native
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          </ScrollView>
        </View>}

        <Separator/>
        {/* ovde ide graf temperaturaaaaa */}
        {_.map(_.reverse(info), i =>
          <View>
          <Card.Content>
            <Title>{_.get(_.filter(users, v => i.creator === v.id), '[0].fullName')}</Title>
            <Paragraph>{moment(i.created_at).format('YYYY-MM-DD')}</Paragraph>
            
            <Title>Info</Title>
            <Paragraph>{i.info}</Paragraph>

            <Title>Temperatura</Title>
            <Paragraph>{i.temperature}</Paragraph>
  
            <Title>Trenutne Bolesti</Title>
              {!_.isEmpty(i.diseaseArray) 
              ? _.map(i.diseaseArray, (d,i) => <Paragraph key={i}>- {_.get(_.filter(diseases, v => d === v.id), '[0].name')}</Paragraph>)
              : <Paragraph>Nema pripisanih ljekova</Paragraph>}

            <Title>Pripisani Ljekovi</Title>
              {!_.isEmpty(i.medicamentArray) 
              ? _.map(i.medicamentArray, (d,i) => <Paragraph key={i}>- {_.get(_.filter(medicaments, v => d === v.id), '[0].name')}</Paragraph>)
              : <Paragraph>Nema pripisanih ljekova</Paragraph>}
            
          </Card.Content>
          <Separator/>
        </View>
        )}
      </Card>}
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

export default Vizita