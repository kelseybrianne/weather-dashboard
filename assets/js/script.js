var APIKey = "41200b32e10879046d4df40eb99353ec";
console.log ($("#city")); // Working

var fetchButton = $("#fetch-button");

function getCityForecast(event) {
    var city = $("#city").val(); 
    event.preventDefault();
    
    var requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    var today = moment().format("MM-DD-YYYY")
    
    fetch(requestCurrentUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var lastUpdated = moment.unix(data.dt).format("h:mm A")
        console.log(data);
        iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}
        @2x.png`;
        var currentWeather = 
        `<div class="ml-3 mb-5 p-4 card bg-light text-dark text-white d-block today-custom">
            <img id="wicon" src="${iconURL}.png">
            <h5 class="card-title">${data.name}</h5>
            <h6 class="card-subtitle mb-3 text-muted">Last updated at ${lastUpdated} for ${today}</h6>
            <p class="card-text">Temp: ${data.main.temp} &#176F</p>
            <p class="card-text">Wind: ${data.wind.speed} MPH</p>
            <p class="card-text">Humidity: ${data.main.humidity}%</p>
            <p style="display: inline" class="card-text">UV Index: </p>
            <p id="uv-index" class="rounded text-light p-2" style="display: inline"></p>
        </div>`
        $("#new-weather-data").append(currentWeather)

        var currentCity = 
        `<button href="#" class="list-group-item list-group-item-action m-1 rounded" aria-current="false">${data.name}</button>`
        $("#city-history").append(currentCity)

        var lat = data.coord.lat
        var lon = data.coord.lon
    
        var requestFiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`;

        
        fetch(requestFiveDayURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for(var i=0; i<5; i++) {
                var fiveDayForecast = 
                `<div class="col-2 card bg-light p-0 mx-3 mb-3 card-custom" style="max-width: 18rem;">
                    <div class="card-header day">Header</div>
                    <div class="card-body">
                        <h5 class="card-title icon">Light card title</h5>
                        <p class="card-text">Example text</p>
                        <p class="card-text">Example text</p>
                        <p class="card-text">Example text</p>
                    </div>
                </div>`
                $("#five-days").append(fiveDayForecast);
                
                if (data.current.uvi <= 5) {
                    $("#uv-index").addClass("favorable");
                } else if (data.current.uvi > 5 && data.current.uvi < 8) {
                    $("#uv-index").addClass("moderate");
                } else if (data.current.uvi >= 8) {
                    $("#uv-index").addClass("severe");
                };

                $("#uv-index").text(data.current.uvi);
            
       



        
        


                // Use the console to examine the response
                // TODO: Loop through the data and generate your HTML
                // for(var i=0; i<data.length; i++) {
                //   var newHTML = 
                //   `<h1>${data[i].login}</h1>
                //   <p>${data[i].html_url}</p>`
        
                //   $("#users").append(newHTML);
                // }
            };                       
        });
    });
};

fetchButton.click(getCityForecast);