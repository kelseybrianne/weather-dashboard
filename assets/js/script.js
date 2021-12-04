var APIKey = "41200b32e10879046d4df40eb99353ec";

function getCityForecast(event) {
    event.preventDefault();
    
    // Get value of the city input
    var city = $("#city").val(); 
    
    var requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${APIKey}`;
    
    
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
        `<div class="ml-3 mb-5 p-4 card bg-light text-dark text-white d-block today-custom">
        <img id="wicon" src="${iconURL}">
        <h5 class="card-title">${data.name}</h5>
        <h6 class="card-subtitle mb-3 text-muted">Last updated at ${lastUpdated} for ${today}</h6>
        <p class="card-text">Temp: ${data.main.temp} &#176F</p>
        <p class="card-text">Wind: ${data.wind.speed} MPH</p>
        <p class="card-text">Humidity: ${data.main.humidity}%</p>
        <p style="display: inline" class="card-text">UV Index: </p>
        <p id="uv-index" class="rounded text-light p-2" style="display: inline"></p>
        </div>`
        $("#new-weather-data").append(currentWeather)

        console.log(iconURL);
        
        // Add searched city to search history list
        var currentCity = 
        `<button href="#" class="list-group-item list-group-item-action m-1 rounded" aria-current="false">${data.name}</button>`
        $("#city-history").append(currentCity)

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
                `<div class="col-2 card bg-light p-0 mx-3 mb-3 card-custom" style="max-width: 18rem;">
                    <div class="card-header day">${moment.unix(data.daily[i].dt).format("ddd MM-DD")}</div>
                    <div class="card-body">
                        <img id="wicon" src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png">
                        <p class="card-text">Temp: ${data.daily[i].temp.day}&#176F</p>
                        <p class="card-text">Wind: ${data.daily[i].wind_speed} MPH</p>
                        <p class="card-text">Humidity: ${data.daily[i].humidity}%</p>
                    </div>
                </div>`
                $("#five-days").append(fiveDayForecast);
                
            };     
            
            // From the <button> CONTAINER element, listen to the <button> "click"
                
                // Get the city from the button's data attribute
            
            // currentCity.on("click", function() {

            //     city = data.name
            //     getCityForecast();
                
            // });
        });
    });
};

// Add search city weather function on click
$("#submit").submit(getCityForecast);