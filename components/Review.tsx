import React, { useEffect, useContext } from 'react';
import _ from 'lodash'
import { Card, Title, Paragraph, Portal, Button, Provider } from 'react-native-paper';

import {ScrollView, TouchableHighlight} from 'react-native'
import moment from 'moment'
import { AppContext } from "../provider/AppContext";
import { Text, View } from './Themed';

const Review = ({chartInfo}) => {
  // if(_.isEmpty(pdfs)) {
  //   return (
  //     <View>
  //       <Text> loadingggg</Text>
  //     </View>
  //   )
  // } 

  const test = useContext(AppContext);
  

  console.log('revssiews---',test)
  return (
    <ScrollView>
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

export default Review