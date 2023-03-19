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





const getApi = (url) => {
    fetch(url)
    .then(function (response) {
        console.log(response)
      console.log(response.status);
      //  Conditional for the the response.status.
      if (response.status !== 200) {
        
       
      } else{
        return response.json();
      }

    })
    .then(function (data) {
      // Make sure to look at the response in the console and read how 404 response is structured.
      console.log(data);
      console.log(data)
    });
}
// getApi(`http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${apiKey}`)

const searchForGeography = (cityChosen) => {
  var apiGettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${cityChosen}&limit=5&appid=${apiKey}`
  const results = getApi(apiGettingLocation)
  console.log(results)
  return results;
}

const searchForWeather = (longitude, latitude) => {
  var apiGettingWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

}

searchForGeography('toronto')

