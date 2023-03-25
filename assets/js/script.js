var apiKey = "4ff9755a40b1f93357da2abcf7c704dc";
// var apiGettingWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
// var apiGettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
var searchButton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput')


const kelvin2Fahrenheit = (temp) => {
  var celcius = temp - 273.15;
  var fahrenheit = (celcius * 1.8) + 32;
  return fahrenheit.toFixed(2)
}

const searchForGeography = (cityChosen) => {
  var apiGettingLocationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityChosen}&limit=5&appid=${apiKey}`
  // getApi(apiGettingLocationUrl)

  fetch(apiGettingLocationUrl)
    .then(function (response) {
        console.log(response)
      console.log(response.status);
      //  Conditional for the the response.status.
      if (response.status !== 200) {
        console.log(response.status)
       
      } else{
        return response.json();
      }

    })
    .then(function (weather) {
      console.log(weather[0])
      return weather[0];
    }).then(function(location){
      console.log(location)
      var {lon, lat} = location;
      searchCurrentWeather(lon, lat)
      searchWeather5Days(lon, lat)
    })
}


const searchCurrentWeather = (longitude, latitude) => {
  var apiGettingWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  // getApi(apiGettingWeatherUrl).then(function(weather){
  //   console.log(weather)
  // })
  fetch(apiGettingWeatherUrl)
    .then(function (response) {
      //  Conditional for the the response.status.
      if (response.status !== 200) {
       
      } else{
        return response.json();
      }

    })
    .then(function (weather) {
      var weatherInfo = {
        currentTemp: weather.main.temp,
        lowTemp: weather.main.temp_min,
        highTemp: weather.main.temp_max,
        icon: weather.weather[0].icon,
        windSpeed: weather.wind.speed,
        humidity: weather.main.humidity,
        cityName: weather.name,
      }
      updateCurrentWeather(weatherInfo)
    });
}

const updateCurrentWeather = (weatherInfo) => {
  console.log(weatherInfo.icon)
  var {currentTemp, lowTemp, highTemp, icon, windSpeed, humidity, cityName} = weatherInfo;
  var currentCityName = document.getElementById('current-city-title');
  var overAllTemp = document.getElementById('overall-temp');
  var currentWind = document.getElementById('current-wind');
  var currentHumidity = document.getElementById('current-humidity');
  var currentIcon = document.getElementById('current-icon');
  var highTempFH = kelvin2Fahrenheit(highTemp);
  var lowTempFH = kelvin2Fahrenheit(lowTemp)
  var iconUrl =  `https://openweathermap.org/img/wn/${icon}@2x.png`;
  currentCityName.textContent = cityName;
  overAllTemp.textContent = `Temp: H: ${highTempFH}\u00B0 L: ${lowTempFH}\u00B0`;
  currentWind.textContent = 'Wind: ' + windSpeed + 'MPH';
  currentHumidity.textContent = 'Humidity: ' + humidity + '%';
  
console.log(iconUrl)

  currentIcon.setAttribute('src', iconUrl)
  currentIcon.style.display = 'block';

  console.log(currentIcon)
}

const searchWeather5Days = (longitude, latitude) => {
  var apigettingWeather5Days = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  fetch(apigettingWeather5Days)
  .then(function (response) {
    if (response.status !== 200) {
     
    } else{
      return response.json();
    }

  })
  .then(function (weather) {
    console.log(weather)


  });
}

const selectCity = (e) =>{
  var city = searchInput.value.trim()


  searchForGeography(city)


  
}

const selectDefaultCity = (e) => {
  const citySelected = e.target.getAttribute('data-city')
}




searchButton.addEventListener('click', selectCity)