var APIKey = "41200b32e10879046d4df40eb99353ec";
console.log ($("#city")); // Working

var fetchButton = $("#fetch-button");

function getCityForecast(event) {
    var city = $("#city").val(); //Not working
    console.log(city); // Not working   
    event.preventDefault();
    console.log("IT WORKED");
    var requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    
  
    fetch(requestCurrentUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var currentWeather = 
        ``


        var lat = data.coord.lat
        var lon = data.coord.lon
        console.log(lat + "," + lon);
        var requestFiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`;

        // fetch(requestFiveDayURL)




        // Use the console to examine the response
        console.log(data);
        // TODO: Loop through the data and generate your HTML
        // for(var i=0; i<data.length; i++) {
        //   var newHTML = 
        //   `<h1>${data[i].login}</h1>
        //   <p>${data[i].html_url}</p>`
  
        //   $("#users").append(newHTML);
        // }
      });

  }
  fetchButton.click(getCityForecast);