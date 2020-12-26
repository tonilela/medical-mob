import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Dimensions, TouchableHighlight, Button, TextInput } from 'react-native';
import _ from 'lodash'
import { TabView, SceneMap } from 'react-native-tab-view';

import EditScreenInfo from '../components/EditScreenInfo';
import Vizita from '../components/Vizita';
import { Text, View } from '../components/Themed';
import { getAllUserData, getAllStaticData } from "../helper/user";


const initialLayout = { width: Dimensions.get('window').width };

export default function Profile(props) {
  const [chartInfo, setChartInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [diseases, setDiseases] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [openChart, setOpenChartCreate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [routes] = React.useState([
    { key: 'first', title: 'VizitaTab' },
    { key: 'second', title: 'ReviewTab' },
    { key: 'third', title: 'NalaziTab' },
  ]);
 
  // const [modalOpen, setModalOpen] = useState(false)

  const getAll = async (id, patient_id) => {
    const chart = await getAllUserData(id, patient_id)
  
    setChartInfo(chart)
  }

  useEffect(() => {
    setLoading(true)

    async function getAllData (id, patient_id) {
      await getAll(id, patient_id)
    }

    async function getStaticData (id, patient_id) {
      const { users, diseases, medicaments, pdf } = await getAllStaticData(id, patient_id)
    
      setMedicaments(medicaments.medicaments)
      setDiseases(diseases.diseases)
      setPdfs(pdf)
      setUsers(users.users)
    }

    const {id, patient_id} = _.get(props, 'route.params')
    console.log('chart componetna',id)
    getAllData(id, patient_id)
    getStaticData(id, patient_id)
    setLoading(false)
  }, []);

  console.log('all dataaaaa----', users, chartInfo, diseases, pdfs, medicaments)

  const VizitaTab = () => (
    <Vizita
    users={users}
    chartInfo={chartInfo}
    diseases={diseases}
    medicaments={medicaments}
  />
  );
  
  const ReviewTab = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
  );

  const NalaziTab = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
  );

  const renderScene = SceneMap({
    first: VizitaTab,
    second: ReviewTab,
    third: NalaziTab,
  });
 

  if(loading) {
    return (
      <View>
        <Text> loadingggg</Text>
      </View>
    )
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
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
  scene: {
    flex: 1,
  },
});
