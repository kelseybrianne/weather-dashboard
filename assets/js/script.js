var APIKey = "41200b32e10879046d4df40eb99353ec";
histArr = [];
var requestCurrentUrl

// Get the cities from local storage and put in array if it's not empty
var searchedCities = JSON.parse(localStorage.getItem("search-history"))
if (searchedCities !== null) {
    histArr = searchedCities;
}

// Render cities to the search history section in the form of a button
for (i=0; i<histArr.length; i++) {
    var currentCity = 
    `<button href="#" class="list-group-item list-group-item-action m-1 rounded" aria-current="false" id="current-city" data-name="${searchedCities[i]}">${searchedCities[i]}</button>`
    $("#city-history").append(currentCity)
}

var fetchData = function() {
    fetch(requestCurrentUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        
        // Get access to current time and date and format it for display
        var lastUpdated = moment.unix(data.dt).format("h:mm A")
        var today = moment().format("MM-DD-YYYY")
        
        // Add weather icons to page
        iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        // Add current weather to page for searched city
        var currentWeather = 
        `<div class="ml-3 mb-5 p-4 card bg-light text-dark d-block today-custom d-inline">
        <h5 class="card-title">${data.name}  <img id="wicon" class="icon" src="${iconURL}"></h5>
        
        <h6 class="card-subtitle mb-3 text-muted">Last updated at ${lastUpdated} for ${today}</h6>
        <p class="card-text">Temp: ${data.main.temp} &#176F</p>
        <p class="card-text">Wind: ${data.wind.speed} MPH</p>
        <p class="card-text">Humidity: ${data.main.humidity}%</p>
        <p style="display: inline" class="card-text">UV Index: </p>
        <p id="uv-index" class="rounded text-light p-2" style="display: inline"></p>
      </div>`
        $("#new-weather-data").append(currentWeather)
          
        var lat = data.coord.lat
        var lon = data.coord.lon
        
        var requestFiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}&units=imperial`;
        
        fetch(requestFiveDayURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            
            // Add UV Index for current weather from data in one call API
            if (data.current.uvi <= 5) {
                $("#uv-index").addClass("favorable");
            } else if (data.current.uvi > 5 && data.current.uvi < 8) {
                $("#uv-index").addClass("moderate");
            } else if (data.current.uvi >= 8) {
                $("#uv-index").addClass("severe");
            };
            $("#uv-index").text(data.current.uvi);
            
            // Add five day forecast
            for(var i=1; i<6; i++) {
                var fiveDayForecast = 
                `<div class="col-sm-11 col-md-5 col-lg-2 card bg-dark text-light p-0 mx-2 mb-3 card-custom" style="max-width: 18rem;">
                <div class="card-header day">${moment.unix(data.daily[i].dt).format("ddd MM-DD")}</div>
                <div class="card-body pt-0">
                <img id="wicon" src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png">
                <p class="card-text">Temp: ${data.daily[i].temp.day}&#176F</p>
                <p class="card-text">Wind: ${data.daily[i].wind_speed} MPH</p>
                <p class="card-text">Humidity: ${data.daily[i].humidity}%</p>
                </div>
                </div>`
                $("#five-days").append(fiveDayForecast);   
            };     
        });
    });
};

function getCityForecast(event) {
    event.preventDefault();
    
    // Get value of the city input
    var city = $("#city").val()

    if(city == "") {
        return;
    }
    
    requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${APIKey}`;
    
    // Clear the page or current data when displaying new city
    $(".today-custom").remove();
    $(".card-custom").remove();
    fetchData();

    // console.log(city)
    // for (i=0; i<histArr.length; i++) {
    //     console.log(histArr[i]);
    //     if (city == histArr[i]) {
    //         return;
    //     } else {
    //     }
    // }

    histArr.push(city);

    localStorage.setItem("search-history", JSON.stringify(histArr));
    $(".list-group-item").remove();

    for (i=0; i<histArr.length; i++) {
        var currentCity = 
        `<button href="#" class="list-group-item list-group-item-action bg-light text-dark m-1 rounded" aria-current="false" id="current-city" data-name="${histArr[i]}">${histArr[i]}</button>`

        $("#city-history").append(currentCity)
    }
    
};

// Add event listener to search history buttons to render that city to the page
$("#city-history").on("click", "button", function(event) {

    city = $(event.target).attr("data-name");
    $(".today-custom").remove();
    $(".card-custom").remove();

    requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${APIKey}`;
       
    fetchData();
});

// Add search city weather function on click
$("#submit").submit(getCityForecast);