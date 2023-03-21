var latitude;
var longitude;
var apiKey = "4ff9755a40b1f93357da2abcf7c704dc";
var city;
var stateCode;
var countryCode;
var limit;
var apiGettingWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
var apiGettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
var searchButton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput')

let myResults
// const


async function getApi (url) {
   const results = await fetch(url)
    .then(function (response) {
        console.log(response)
      console.log(response.status);
      //  Conditional for the the response.status.
      if (response.status !== 200) {
        
       
      } else{
        return response.json();
      }

    })
    .then(function (weather) {
      // Make sure to look at the response in the console and read how 404 response is structured.
      console.log(weather);
      return weather;
    });
    return results
}

const searchForGeography = (cityChosen) => {
  var apiGettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${cityChosen}&limit=5&appid=${apiKey}`
  const results = getApi(apiGettingLocation)
  console.log(results)
  return results;
}

const searchForWeather = (longitude, latitude) => {
  var apiGettingWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

}

const selectCity = (e) =>{
  var city = searchInput.value.trim()
  console.log(city)

  var cityLocation = searchForGeography(city)
  console.log(cityLocation)
  console.log(myResults)

  
}

const selectDefaultCity = (e) => {
  const citySelected = e.target.getAttribute('data-city')
}




searchButton.addEventListener('click', selectCity)
