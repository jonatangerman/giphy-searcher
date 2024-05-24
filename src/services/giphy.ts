import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.giphy.com/v1/'
})

const fetchGifs = (params) => {
  return api
    .get('gifs/search?api_key=pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa', {
      params
    })
    .then((response) => {
      return response.data
    })
    .catch((e) => {
      console.error(e)
    })
}

export { fetchGifs }
