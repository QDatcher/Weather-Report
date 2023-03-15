const baseApiUrl = 'https://api.openweathermap.org';







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