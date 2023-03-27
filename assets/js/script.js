var apiKey = "4ff9755a40b1f93357da2abcf7c704dc";
// var apiGettingWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
// var apiGettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
var searchButton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput')
var specialWeatherButton = document.getElementById('specialWeather')
var citiesArr = []
var windSpeed = 10;
var weatherReporting = false
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
      //  Conditional for the the response.status.
      if (response.status !== 200) {
       
      } else{
        return response.json();
      }

    })
    .then(function (weather) {
      return weather[0];
    }).then(function(location){
      console.log(location)
      var {lon, lat, name} = location;
      searchCurrentWeather(lon, lat, name)
      searchWeather5Days(lon, lat)
    })
}


const searchCurrentWeather = (longitude, latitude, name) => {
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
      console.log(weather)
      var weatherInfo = {
        currentTemp: weather.main.temp,
        lowTemp: weather.main.temp_min,
        highTemp: weather.main.temp_max,
        icon: weather.weather[0].icon,
        windSpeed: weather.wind.speed,
        humidity: weather.main.humidity,
        cityName: name
      }
      console.log(weatherInfo.cityName)
      updateCurrentWeather(weatherInfo)
    });
}

const updateCurrentWeather = (weatherInfo) => {
  var {currentTemp, lowTemp, highTemp, icon, windSpeed, humidity, cityName} = weatherInfo;
  var currentCityName = document.getElementById('current-city-title');
  var overAllTemp = document.getElementById('overall-temp');
  var currentWind = document.getElementById('current-wind');
  var currentHumidity = document.getElementById('current-humidity');
  var currentIcon = document.getElementById('current-icon');
  var highTempFH = kelvin2Fahrenheit(highTemp);
  var lowTempFH = kelvin2Fahrenheit(lowTemp)
  var currentTempFH = kelvin2Fahrenheit(currentTemp)
  var iconUrl =  `https://openweathermap.org/img/wn/${icon}@2x.png`;
  currentCityName.textContent = cityName;
  overAllTemp.textContent = `Current Temp: ${currentTempFH}\u00B0 (H: ${highTempFH}\u00B0 L: ${lowTempFH}\u00B0)`;
  currentWind.textContent = 'Wind: ' + windSpeed + 'MPH';
  currentHumidity.textContent = 'Humidity: ' + humidity + '%';
  
  currentIcon.setAttribute('src', iconUrl)
  currentIcon.setAttribute('alt', 'iconUrl')
  currentIcon.style.display = 'block';

}

const searchWeather5Days = (longitude, latitude) => {
  var apigettingWeather5Days = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  fetch(apigettingWeather5Days)
  .then(function (response) {
    if (response.status !== 200) {
     
    } else{
      return response.json();
    }

  }).then(function(weatherObject){
    return weatherObject.list
  })
  .then(function (weatherList) {
    console.log(weatherList)
    var weather5days = [];
    for(let i = 0; i < 5; i++ ){
      var tommorrow = dayjs().add(1 + i, 'day').format('YYYY-MM-DD 00:00:00')
      for(let j = 0; j < weatherList.length; j++){
        if(tommorrow == weatherList[j].dt_txt){
          weather5days.push(weatherList[j])
        }
      }
      
    }

    update5DayForcast(weather5days)
  });
}

const update5DayForcast = (weather5Days) => {
  var container = document.getElementById('card-container')
  console.log(container)
  for(let i = 0; i < container.children.length; i++){
    var dateText = dayjs().add(1 + i, 'day').format('MM-DD-YYYY')
    var dayContainer = container.children[i];
    console.log(dayContainer)
    var weatherInfo = weather5Days[i];
    console.log(weatherInfo)
    var date = dayContainer.querySelector('div').querySelector('h5')
    var icon = dayContainer.querySelector('div').querySelector('img');
    var temp = dayContainer.querySelector('.temp5')
    var wind = dayContainer.querySelector('.wind5')
    var hum = dayContainer.querySelector('.hum5')
    var iconUrls =  `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;
    var highTempFH5 = kelvin2Fahrenheit(weatherInfo.main.temp_max)
    var lowTempFH5 =kelvin2Fahrenheit(weatherInfo.main.temp_min)
    var windSpeed5 = weatherInfo.wind.speed;
    var humtext =weatherInfo.main.humidity; 
    console.log(weatherInfo.weather[0].icon)

    icon.setAttribute('src', iconUrls)
    icon.setAttribute('alt', weatherInfo.weather[0].main)
    date.textContent = dateText
    temp.textContent = `H: ${highTempFH5}\u00B0 L: ${lowTempFH5}\u00B0`
    wind.textContent = 'Wind: ' + windSpeed5 + 'MPH'
    hum.textContent = 'Humidity: ' + humtext + '%';

  }
}

const loadCityButtons = () => {
  var buttonContainer = document.getElementById('suggestion-container');
  console.log(buttonContainer)
  var recentlySavedcities = JSON.parse(localStorage.getItem('cities'));

  for(let index = 0; index < buttonContainer.children.length; index++){
    if(recentlySavedcities[index] != null){
      buttonContainer.children[index].style.display = 'block';
      buttonContainer.children[index].textContent = recentlySavedcities[index]
      buttonContainer.children[index].addEventListener('click', previousSearchSelect)
    } else {
      buttonContainer.children[index].style.display = 'none';
    }
   
  }
}

const selectCity = (e) =>{
  weatherReporting = false;
  var MrWeather = document.getElementById('MrWeather')
  MrWeather.style.display = 'none';
  var city = searchInput.value.trim()

  if(city == ''){
    return
  }

  var savedCities = JSON.parse(localStorage.getItem('cities'));

  if(citiesArr.length == 0 && savedCities != null){
    citiesArr = citiesArr.concat(savedCities)
    
} 

// var found = savedCities.find(possiblecity => possiblecity == city)

// if(found){
  
// } else {
//   citiesArr.unshift(city)
// }
  citiesArr.unshift(city)

console.log(citiesArr)
localStorage.setItem('cities', JSON.stringify(citiesArr))

  searchForGeography(city)
  loadCityButtons()


  
}

const selectDefaultCity = (e) => {
  const citySelected = e.target.getAttribute('data-city')
}

const previousSearchSelect = (e) => {
  weatherReporting = false;
  var MrWeather = document.getElementById('MrWeather')
  MrWeather.style.display = 'none';
  var citySelected = e.target.textContent
  searchForGeography(citySelected)
}

const specialWeatherReport = (e) => {
  weatherReporting = true;
  var MrWeather = document.getElementById('MrWeather')
  MrWeather.style.display = 'block';
  var currentCityName = document.getElementById('current-city-title');
  var overAllTemp = document.getElementById('overall-temp');
  var currentWind = document.getElementById('current-wind');
  var currentHumidity = document.getElementById('current-humidity');
  var currentIcon = document.getElementById('current-icon');

  currentCityName.textContent ='Port St. Lucie, Florida';
  overAllTemp.textContent = 'Temp: ∞';
  currentHumidity.textContent = 'Humidity: ∞';
  setTime()


  currentIcon.setAttribute('src', './assets/imgs/frog.png')
  
  var allTemp5 = document.querySelectorAll('.temp5');
  var allHum5 = document.querySelectorAll('.hum5');
  var allicon5 = document.querySelectorAll('.icon5');
  console.log(allicon5)
  for(let index = 0; index < allTemp5.length; index++){
    allTemp5[index].textContent = 'Temp: ∞'
    allHum5[index].textContent = 'Humidity: ∞'
    allicon5[index].setAttribute('src', './assets/imgs/frog.png')
  }




}

function setTime() {
  // Sets interval in variable
  var timerInterval = setInterval(function() {
    var currentWind = document.getElementById('current-wind')
    var windSpeed5 = document.querySelectorAll('p.wind5')
    for(let index = 0; index < windSpeed5.length; index++){
      windSpeed5[index].textContent = 'WindSpeed:' + windSpeed + " MPH";
    }
    currentWind.textContent = 'WindSpeed:' + windSpeed + " MPH"; 
    windSpeed = windSpeed * 10;

    if(weatherReporting == false){
      clearInterval(timerInterval);
    }
    

  }, 100);
}

var savedCitiesPageLoad = JSON.parse(localStorage.getItem('cities'))
if(savedCitiesPageLoad != null){
  loadCityButtons()
}



searchButton.addEventListener('click', selectCity)
specialWeatherButton.addEventListener('click', specialWeatherReport)

