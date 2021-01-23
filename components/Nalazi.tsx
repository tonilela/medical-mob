import * as React from 'react';
import { DataTable, Card, Paragraph } from 'react-native-paper';
import _ from 'lodash'
import {ScrollView, TouchableHighlight} from 'react-native'
import moment from 'moment'
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

import { Text, View } from './Themed';

const Nalazi = ({pdfs, users}) => {
  if(_.isEmpty(pdfs)) {
    return (
      <View>
        <Text> loadingggg</Text>
      </View>
    )
  } 
  const handleDownload = async(id, upload_file_name) => {
    // console.log('id---------',id)
    const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (perm.status != 'granted') {
      return;
    }
    const fileUri: string = `${FileSystem.documentDirectory}${upload_file_name}`;
    const {uri} =  await FileSystem.downloadAsync(`https://medial-api.s3.eu-central-1.amazonaws.com/chart/${id}`,  fileUri);
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync('Download');
    if (album == null) {
      await MediaLibrary.createAlbumAsync('Download', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }
    // console.log(da)
  }
  // console.log('pdfffff---',pdfs)
  return (
    <ScrollView>

<Card>
        <Card.Content>
    <DataTable>
      <DataTable.Header>
        {/* <DataTable.Title>ID</DataTable.Title> */}
        <DataTable.Title >Doktor</DataTable.Title>
        <DataTable.Title >Datum</DataTable.Title>
        <DataTable.Title >Preuzmi</DataTable.Title>
      </DataTable.Header>
      {pdfs.pdfs.map(pdf => {
        const {id, created_at, user_id, upload_file_name, upload_file_uuid } = pdf
        // console.log('tuuuuuuuuuuuuu')
        const Doctor = _.get(_.filter(users, v => user_id === v.id), '[0].fullName')
        // console.log(Doctor)
        return(
          <DataTable.Row key={id} >
            {/* <DataTable.Cell>{id}</DataTable.Cell> */}
            <DataTable.Cell >{Doctor}</DataTable.Cell>
            <DataTable.Cell >{moment(created_at).format('YYYY-MM-DD')}</DataTable.Cell>
            <DataTable.Cell> 
              <TouchableHighlight
                onPress={()=>handleDownload(upload_file_uuid, upload_file_name)}
              >
                <Text>{upload_file_name}</Text>
              </TouchableHighlight>
            </DataTable.Cell>
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

        </Card.Content>
    </Card>
    </ScrollView>
  )
};

export default Nalazi