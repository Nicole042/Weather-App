
import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import WeatherCard from './components/WeatherCard'
import '../src/weatherLoading.css'

function App() {

  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temp, setTemp] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  

  const obtenerLonLat = position => {
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }
    setCoords(obj)
  }

  const geolocationError = error => {
    if (error.code === 1) {
      setError(true)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(obtenerLonLat, geolocationError)
  }, [])
  
  useEffect(() => {
    if(coords) {

      const api_key = '5a978fe32bceb051ed4e4d605f4a7ff0'
      const { lat, lon }  = coords

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`

      axios.get(url)
      .then(res => {
        setWeather(res.data)
        const obj = {
          celsius: (res.data.main.temp - 273.15).toFixed(1),
          fahrenheit: ((res.data.main.temp - 273.15) * 9/5 +32).toFixed(1)
        }
        setTemp(obj)
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
    }

  }, [coords])

  return (
    <div className='app'>
      {
      error 
      ? <p className='weather_error'>Permiso para acceder a la ubicacion denegado</p>
      : (
      isLoading 
        ? <div className='loader'></div>
        : (
      <WeatherCard 
      weather={weather}
      temp={temp}
          />
        )
      )
      }
    </div>
  )
}

export default App
