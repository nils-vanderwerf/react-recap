import axios from 'axios'

// Single axios instance used across the app — base URL points to the jsonfakery REST API
export default axios.create({
  baseURL: 'https://jsonfakery.com',
})
