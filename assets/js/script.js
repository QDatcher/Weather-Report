//These are starter varibles needed globally
var apiKey = "4ff9755a40b1f93357da2abcf7c704dc";
var searchButton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput')
var specialWeatherButton = document.getElementById('specialWeather')
var citiesArr = []
var windSpeed = 10;
var weatherReporting = false

//This convertts kelvin to Fahrenheit
const kelvin2Fahrenheit = (temp) => {
  var celcius = temp - 273.15;
  var fahrenheit = (celcius * 1.8) + 32;
  return fahrenheit.toFixed(2)
}
//This will search for the long lat and official name of the city we sby use of an api then calls functions to access the weather info
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
      var {lon, lat, name} = location;
      searchCurrentWeather(lon, lat, name)
      searchWeather5Days(lon, lat)
    })
}

//This uses the geo info to get the current weather of a city then sends that info to a fucntion taht will display it
const searchCurrentWeather = (longitude, latitude, name) => {
  var apiGettingWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

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
        cityName: name
      }
      updateCurrentWeather(weatherInfo)
    });
}
//This fucntion displays the weather info in our currentCity section
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
//This uses the api to see the weather of the next 5 days and sends it to a function to that updates the dom to display that data
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
//This takes data from the api that it was sent and updates the 5day forecast section
const update5DayForcast = (weather5Days) => {
  var container = document.getElementById('card-container')
  for(let i = 0; i < container.children.length; i++){
    var dateText = dayjs().add(1 + i, 'day').format('MM-DD-YYYY')
    var dayContainer = container.children[i];
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

    icon.setAttribute('src', iconUrls)
    icon.setAttribute('alt', weatherInfo.weather[0].main)
    date.textContent = dateText
    temp.textContent = `H: ${highTempFH5}\u00B0 L: ${lowTempFH5}\u00B0`
    wind.textContent = 'Wind: ' + windSpeed5 + 'MPH'
    hum.textContent = 'Humidity: ' + humtext + '%';

  }
}

//This function places the last recent cities you've searched into buttons to click for easy access
const loadCityButtons = () => {
  var buttonContainer = document.getElementById('suggestion-container');
  var recentlySavedcities = JSON.parse(localStorage.getItem('cities'));


  for(let index = 0; index < buttonContainer.children.length; index++){

    if(recentlySavedcities[index]){
      buttonContainer.children[index].style.display = 'block';
      buttonContainer.children[index].textContent = recentlySavedcities[index]
      buttonContainer.children[index].addEventListener('click', previousSearchSelect)
    } else {
      buttonContainer.children[index].style.display = 'none';
    }
   
  }
}


//This takes your input updates it to the most recent search list and begins the process of running the geo search
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

//This function allows previous search buttons to actually take effect by calling the searchForGeography function with the name you previously searched
const previousSearchSelect = (e) => {
  weatherReporting = false;
  var MrWeather = document.getElementById('MrWeather')
  MrWeather.style.display = 'none';
  var citySelected = e.target.textContent
  searchForGeography(citySelected)
}

//Side project for fun lol. Hope you're a JOJO fan
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
//This is for the JOJO stuff
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

//Loads th
var savedCitiesPageLoad = JSON.parse(localStorage.getItem('cities'))
if(savedCitiesPageLoad != null){
  loadCityButtons()
} else {
  var searchButtonContainer = document.getElementById('suggestion-container');


  for(let index = 0; index < searchButtonContainer.children.length; index++){

      searchButtonContainer.children[index].style.display = 'none'
   
  }
}



searchButton.addEventListener('click', selectCity)
specialWeatherButton.addEventListener('click', specialWeatherReport)

