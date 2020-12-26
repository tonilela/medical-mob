import * as React from 'react';
import { DataTable } from 'react-native-paper';
import _ from 'lodash'
import moment from 'moment'

import { Text, View } from '../components/Themed';

const Table = ({charts, handlePress}) => {
  if(_.isEmpty(charts)) {
    return (
      <View>
        <Text> loadingggg</Text>
      </View>
    )
  } 

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>ID</DataTable.Title>
        <DataTable.Title >Info</DataTable.Title>
        <DataTable.Title >Stvoren</DataTable.Title>
        <DataTable.Title >Zatvoren</DataTable.Title>
      </DataTable.Header>
      {charts.charts.map(chart => {
        const {id, info, created_at, closed_at, patient_id } = chart
        console.log('tuuuuuuuuuuuuu')
        return(
          <DataTable.Row key={id} onPress={()=>{ 
            console.log('ide-----',id, patient_id)
            handlePress(id, patient_id)}}>
            <DataTable.Cell>{id}</DataTable.Cell>
            <DataTable.Cell >{info}</DataTable.Cell>
            <DataTable.Cell >{moment(created_at).format('YYYY-MM-DD')}</DataTable.Cell>
            <DataTable.Cell >{closed_at ? moment(closed_at).format('YYYY-MM-DD'): ''}</DataTable.Cell>
          </DataTable.Row>
          )
        }
        )
      }
      {/* <DataTable.Pagination
        page={1}
        numberOfPages={3}
        onPageChange={page => {
          console.log(page);
        }}
        label="1-2 of 6"
      /> */} 
    </DataTable>
  )
};

export default Table