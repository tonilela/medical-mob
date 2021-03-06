const axios = require('axios')
const _ = require('lodash')

const ipAddress = '192.168.1.113'
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjA5MDU5MTg2fQ.W0L5aLNONBRZtmMPOE5rrAyOmquAbtfn1c8oEC59cJ4`

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
      console.log('response 1 -----',response1)
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

async function getAllUserData (id, patient_id) {
    console.log('getAllUserData======',id, patient_id)
    try {
      const {data: chart} = await axios.get(`http://${ipAddress}:3003/user/${patient_id}/chart/${id}`,{
        headers: {
          Authorization: token,
        },
      })

      console.log('chart------',chart)
    return chart
  } catch (err) {
    console.log('errr',err)
    return false
  }
}
async function getAllStaticData (id, patient_id) {
    console.log('getAllUserData======',id, patient_id)
    try {
      const {data: diseases} = await axios.get(`http://${ipAddress}:3003/disease`,{
        headers: {
          Authorization: token,
        },
        params: { page: 0, rowsPerPage: 1000 }
      })

      const {data: medicaments} = await axios.get(`http://${ipAddress}:3003/medicament`,{
        headers: {
          Authorization: token,
        },
        params: { page: 0, rowsPerPage: 1000 }
      })

      const {data: users} = await axios.get(`http://${ipAddress}:3003/user`,{
        headers: {
          Authorization: token,
        },
        params: { page: 0, rowsPerPage: 1000 }
      })

      const {data: pdf} = await axios.get(`http://${ipAddress}:3003/user/${patient_id}/chart/${id}/pdf`,{
        headers: {
          Authorization: token,
        },
        params: { page: 0, rowsPerPage: 1000 }
      })

      // const {data: temperature} = await axios.get(`http://${ipAddress}:3003/user/${patient_id}/chart/${id}/temperature`,{
      //   headers: {
      //     Authorization: token,
      //   },
      // })

    return {users, diseases, medicaments, pdf}
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

async function createNewChartInfo (userId, chartId, data) {
  const { disease, medicaments, info, temperature} = data
  try {
    await axios.post(`http://${ipAddress}:3003/user/${userId}/chart/${chartId}`, data, {
        headers: {
          Authorization: token,
        },
      },
    )

    return
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

async function loginUser (email) {

  try {
    const login = await axios.post(`http://${ipAddress}:3003/signin/mob`, {email})

    return login
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

async function sendCode (token) {

  try {
    const login = await axios.post(`http://${ipAddress}:3003/auth/token/mob`, {token})

    return login
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

async function saveReview (review, chartId) {

  try {
    console.log('prijeeeee')
    const resp = await axios.post(`http://${ipAddress}:3003/chart/${chartId}/review`, {review},{
      headers: {
        Authorization: token,
      },
    },)

    return _.get(resp, 'data')
  } catch (err) {
    console.log('errr',err)
    return false
  }
}



module.exports = {
  getUser,
  getUserByOIB,
  getAllUserData,
  getAllStaticData,
  createNewChartInfo,
  loginUser,
  sendCode,
  saveReview,
}