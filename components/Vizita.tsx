import  React, { useState, useEffect, useContext } from 'react';
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
import { AppContext } from '../provider/AppContext'
import { theme } from '../assets/theme'
import Spinner from 'react-native-loading-spinner-overlay';

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
  const { user } = useContext(AppContext)
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
  }

  useEffect(() => {
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
  }, []);

  if(_.isEmpty(users)|| _.isEmpty(chartInfo) || _.isEmpty(medicaments) || _.isEmpty(diseases)) {
    return (
      <View>
        <Spinner />
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
      {/* provjera za doktora ide tuuuuuu , da si ne moze sam unositi */}
           {_.get(user, 'title') !== 'patient' && <Button onPress={showModal}>
             Add new
           </Button>}

        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          style={styles.modal}
         >
          <View style={styles.firstView}
          >
          <ScrollView >
          <View style={styles.modalView}>
          <Text style={styles.header}>Add new chart info</Text>
          <View style={styles.parts}>
          <Text style={styles.centerText}>Info</Text>
            <TextInput
              style={styles.textInputStyle}
              value={newInfo}
              numberOfLines={4}
              onChangeText={text => setInfo(text)}
              />
          </View>
          <View style={styles.parts}>

            <Text style={styles.centerText}>Temperature</Text>
            <TextInput
              style={styles.textInputStyle}
              value={temperature}
              onChangeText={text => setTemperature(text)}
              />
          </View>

          <View style={styles.parts}>
            <Text style={styles.centerText}>Disease</Text>
            <SectionedMultiSelect
              items={diseases}
              IconRenderer={MaterialIcons}
              uniqueKey="id"
              subKey="children"
              selectText="Choose diseases"
              showDropDowns={true}
              // readOnlyHeadings={true}
              onSelectedItemsChange={(e)=>handleSelectDisease(e)}
              selectedItems={selectedDisease}
            />
          </View>
          <View style={styles.parts}>

            <Text style={styles.centerText}>Medicaments</Text>
            <SectionedMultiSelect
              items={medicaments}
              IconRenderer={MaterialIcons}
              uniqueKey="id"
              subKey="children"
              selectText="Choose medicaments"
              showDropDowns={true}
              // readOnlyHeadings={true}
              onSelectedItemsChange={(e)=>handleSelectMedicaments(e)}
              selectedItems={selectedMedicaments}
              />
            </View>
          <View style={styles.twoButtons}>

          <Button
              onPress={handleStvoriNovi}
              style={styles.button}
              >
              Save
            </Button>
             <Button
              style={styles.button}
              onPress={hideModal}
            >
              Exit
            </Button>

              {/* <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={handleStvoriNovi}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={hideModal}
              >
                <Text style={styles.textStyle}>Exit</Text>
              </TouchableHighlight> */}
            </View>
          </View>
        </ScrollView>
          </View>
      </Modal>


      {!visible && <Card>
        <Card.Content style={styles.card}>
          <Title>Current Diagnosis:</Title>
          <View style={styles.centerView}>
            <Paragraph style={styles.paragraphTitles}>Identified diseases</Paragraph>
              {!_.isEmpty(lastDisease)
              ? _.map(lastDiseasesMap, (d,i) => <Paragraph style={styles.paragraph} key={i}>- {d}</Paragraph>)
              : <Paragraph style={styles.paragraph}>There are no identified diseases</Paragraph>}
          </View>
          <View style={styles.centerView}>
            <Paragraph style={styles.paragraphTitles}>Prescribed drugs</Paragraph>
              {!_.isEmpty(lastMedicament)
              ? _.map(lastMedicamentsMap, (d, i) => <Paragraph style={styles.paragraph} key={i}>- {d}</Paragraph>)
              : <Paragraph style={styles.paragraph}>There are no prescribed drugs</Paragraph>}
          </View>
        </Card.Content>


        {!_.isEmpty(temperatureArray) && !_.isEmpty(dateArray) && <View>
          <Text style={styles.centerText}>
            Temperature in between dates {_.last(dateArray)} - {_.first(dateArray)}
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
          <View style={styles.card}>
            <Card.Content >
              <View style={styles.infoHeader}>
                <Title>{_.get(_.filter(users, v => i.creator === v.id), '[0].fullName')}</Title>
                <Paragraph style={styles.dateStyle}>{moment(i.created_at).format('YYYY-MM-DD')}</Paragraph>
              </View>

              <Title>Info</Title>
              <Paragraph style={styles.paragraph}>{i.info}</Paragraph>

              <Title>Temperature</Title>
              <Paragraph style={styles.paragraph}>{i.temperature}</Paragraph>

              <Title>Identified diseases</Title>
                {!_.isEmpty(i.diseaseArray)
                ? _.map(i.diseaseArray, (d,i) => <Paragraph style={styles.paragraph} key={i}>- {_.get(_.filter(diseases, v => d === v.id), '[0].name')}</Paragraph>)
                : <Paragraph style={styles.paragraph}>There are no prescribed drugs</Paragraph>}

              <Title>Prescribed drugs</Title>
                {!_.isEmpty(i.medicamentArray)
                ? _.map(i.medicamentArray, (d,i) => <Paragraph style={styles.paragraph} key={i}>- {_.get(_.filter(medicaments, v => d === v.id), '[0].name')}</Paragraph>)
                : <Paragraph style={styles.paragraph}>There are no identified diseases</Paragraph>}

            </Card.Content>
          {/* <Separator/> */}
        </View>
        )}
      </Card>}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginBottom: 40,
  },
  parts: {
    marginBottom: 40,
    // marginTop: 40
  },
  firstView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'},
  modal: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40,
  },
  dateStyle: {
    marginLeft: 'auto',
    paddingTop: 5,
  },
  infoHeader: {
    flexDirection:"row",
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 16,
  },
  centerView: {
    marginLeft:40,
  },
  card: {
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    paddingBottom: 20,
  },
  paragraphTitles: {
    marginTop: 20,
  },
  paragraph: {
    paddingLeft:20,
  },
  centeredView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textInputStyle: {
    width: 250,
    height: 50,
    backgroundColor: 'lightgray',
    marginTop:30,
    textAlign: 'center'
  },
  modalView: {
    marginTop: 50,
    backgroundColor: 'white',
    // borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    // shadowColor: '#000',
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    margin: 10,
  },
})

export default Vizita