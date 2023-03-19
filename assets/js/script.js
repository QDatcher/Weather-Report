var longitude;
var longitude;
var apiKey;
var city;
var stateCode;
var countryCode;
var limit;
var apiGettingWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
var apiGettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`






const getApi(url) => {
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