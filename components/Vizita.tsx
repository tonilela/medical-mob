import * as React from 'react';
import { DataTable, Card, Title, Paragraph, Modal, Portal, Button, Provider } from 'react-native-paper';
import _ from 'lodash'
import moment from 'moment'
import { ScrollView } from "react-native";

import { Text, View } from '../components/Themed';

import Separator from '../components/Separator'

const Vizita = ({users, chartInfo, diseases, medicaments}) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {backgroundColor: 'white', padding: 20};

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

  console.log('lastDiseasesMap-----',users)
  return (
    <ScrollView>
      <Card>
        <Card.Content>
          <Title>Trenutna Diagnoza:</Title>
          <Paragraph>Trenutne Bolesti</Paragraph>
            {!_.isEmpty(lastDisease) 
            ? _.map(lastDiseasesMap, d => <Paragraph>- {d}</Paragraph>)
            : <Paragraph>Nema utvrdenih Bolesti</Paragraph>}
          <Paragraph>Trenutni Ljekovi</Paragraph>
            {!_.isEmpty(lastMedicament) 
            ? _.map(lastMedicamentsMap, d => <Paragraph>- {d}</Paragraph>)
            : <Paragraph>Nema pripisanih ljekova</Paragraph>}
        </Card.Content>
        <Separator/>
        {/* ovde ide graf temperaturaaaaa */}
        {_.map(info, i =>
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
              ? _.map(i.diseaseArray, d => <Paragraph>- {_.get(_.filter(diseases, v => d === v.id), '[0].name')}</Paragraph>)
              : <Paragraph>Nema pripisanih ljekova</Paragraph>}

            <Title>Pripisani Ljekovi</Title>
              {!_.isEmpty(i.medicamentArray) 
              ? _.map(i.medicamentArray, d => <Paragraph>- {_.get(_.filter(medicaments, v => d === v.id), '[0].name')}</Paragraph>)
              : <Paragraph>Nema pripisanih ljekova</Paragraph>}
            
          </Card.Content>
          <Separator/>
        </View>
        )}
      </Card>
      <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button style={{marginTop: 30}} onPress={showModal}>
        Show
      </Button>
    </Provider>
    </ScrollView>
  )
};

export default Vizita