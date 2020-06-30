import axios from 'axios'

const request = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  timeout: 60000,
})

export default request
