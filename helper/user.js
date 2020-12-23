const axios = require('axios')
const _ = require('lodash')

const ipAddress = '192.168.1.156'
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjA3MDEwNjkxfQ.-rud8QxxOyKDvjN2BXVQ4O86dSsDZOq369n3-pwuVoM`

async function getUser (userId) {
    console.log('usli smo tuuu')
    try {
      const user = await axios.get(`http://${ipAddress}:3003/user/${userId}`,{
        headers: {
          Authorization: token,
        },
      })
  
      console.log('users',user)
    return _.get(user, 'data')
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

async function getUserByOIB (oib) {
    console.log('usli smo tuuu')
    try {
      const user = await axios.get(`http://${ipAddress}:3003/user/oib/${oib}`,{
        headers: {
          Authorization: token,
        },
      })
  
      console.log('users',_.get(user, 'data'))
    return _.get(user, 'data')
  } catch (err) {
    console.log('errr',err)
    return false
  }
}

module.exports = {
  getUser,
  getUserByOIB
}