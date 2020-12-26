const axios = require('axios')
const _ = require('lodash')

const ipAddress = '192.168.43.142'
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjA3MDEwNjkxfQ.-rud8QxxOyKDvjN2BXVQ4O86dSsDZOq369n3-pwuVoM`

async function getUser (userId) {
    console.log('usli smo tuuu')
    try {
      const user = await axios.get(`http://${ipAddress}:3003/user/${userId}`,{
        headers: {
          Authorization: token,
        },
      })
  
      // console.log('users',user)
    return _.get(user, 'data')
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

async function getUserByOIB (oib) {
    try {
      const response1 = await axios.get(`http://${ipAddress}:3003/user/oib/${oib}`,{
        headers: {
          Authorization: token,
        },
      })
      // console.log('response 1 -----',response1)
      const user = _.get(response1, 'data')
      const response2 = await axios.get(`http://${ipAddress}:3003/user/${user.id}/chart/mob`,{
        headers: {
          Authorization: token,
        },
      })
  
      const charts = _.get(response2,'data')
      // console.log(charts, user)
    return {user, charts}
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

// async function getAllUserData (id) {
//     console.log('getAllUserData======',id)
//     try {
//       const {data: chart} = await axios.get(`http://${ipAddress}:3003/user/${id}/chart`,{
//         headers: {
//           Authorization: token,
//         },
//       })
      
//     //   const {data: user} = await axios.get(`http://${ipAddress}:3003/user/${id}`,{
//     //     headers: {
//     //       Authorization: token,
//     //     },
//     //   })
//     //   console.log('users',user)
//       console.log('chartsss',chart)
//     // return {user, chart}
//   } catch (err) {
//     console.log('errr',err)
//     return false
//   }
// }

module.exports = {
  getUser,
  getUserByOIB,
  // getAllUserData
}