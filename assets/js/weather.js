// getting the main elements by their class and id

var searchBtnEl = document.querySelector(".btn");
var weatherInfoEl = document.querySelector(".weather-info");
var searchHistoryEl = document.querySelector(".search-history");
var cardEl = document.querySelector(".card");

//getting the weather info from the API

var getWeatherInfo = function () {
    //empty the weather information each time
    weatherInfoEl.textContent = "";

    var searchInput = document.getElementById("weather-search").value.trim();
    var apiKey = "0d48ec19c1db5231554aa0ab7a864b07";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&units=imperial&appid=" + apiKey;
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&units=imperial&appid=" + apiKey;

    console.log(searchInput);

    //make a request to the url
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(response){
            currentWeatherCondidtion(response);
            uvIndex(response);
            addHistory(response);
            
            });
        }else {
            alert("Error:" + response.statusText);
        }
    
    })
    .catch(function(error){
        //Notice this '.catch()' getting chained onto the end of the .then() method
        alert("unable to connect to Weather App! Please try again later");
    });

    //make a request to the forecast url
    fetch(forecastUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(forecast){
            fiveForecast(forecast);
            
            });
        }else {
            alert("Error:" + response.statusText);
        }
    })
    .catch(function(error){
        //Notice this '.catch()' getting chained onto the end of the .then() method
        alert("unable to connect to Weather App! Please try again later");
    });
}



var cardClick = function(event) {
    event.stopPropagation();
    weatherInfoEl.textContent = "";
    var historyInput = document.querySelector(".card").innerHTML;
    console.log(historyInput);

    var apiKey = "0d48ec19c1db5231554aa0ab7a864b07";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + historyInput + "&units=imperial&appid=" + apiKey;
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + historyInput + "&units=imperial&appid=" + apiKey;

    //make a request to the url
    fetch(apiUrl).then(function(historyresponse){
        historyresponse.json().then(function(historyresponse){
            currentWeatherCondidtion(historyresponse);
            uvIndex(historyresponse);
            addHistory(historyresponse);
        });
    });

    //make a request to the forecast url
    fetch(forecastUrl).then(function(response){
        response.json().then(function(forecast){
            fiveForecast(forecast);
        });
    });

}

//display the current weather
var currentWeatherCondidtion = function(response) {
    var value = response.dt;
    var currentDay = moment.unix(response.dt).format("MM/DD/YYYY");

    var cityName = document.createElement("h3");
    cityName.textContent = response.name + " " + "(" + currentDay + ")";

    //create the temperature element
    var temperatureEl = document.createElement("div");
    temperatureEl.classList = "temperature";
    var pEl = document.createElement("p");
    pEl.textContent = "Temperature: " + response.main.temp + "°F";
    temperatureEl.appendChild(pEl);

    //create the humidty Element
    var humidityEl = document.createElement("div");
    humidityEl.classList = "humidty";
    var pHEl = document.createElement("p");
    pHEl.textContent = "Humidity: " + response.main.humidity + "%";
    humidityEl.appendChild(pHEl);

    //create the wind element
    var windSpeedEl = document.createElement("div");
    windSpeedEl.classList = "wind";
    var pWsEl = document.createElement("p");
    pWsEl.textContent = "Wind Speed: " + response.wind.speed + "MPH";
    windSpeedEl.appendChild(pWsEl);

    //create the City Name Element
    var cityNameEl = document.createElement("div");
    cityNameEl.classList = "title";

    //Get the Weather Icon
    var weatherIcon = response.weather[0].icon;
    var weatherImgEl = document.createElement("img");
    weatherImgEl.setAttribute("src" , "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
    weatherImgEl.classList = "weatherIcon";

    //append Element
    cityName.appendChild(weatherImgEl);
    cityNameEl.appendChild(cityName);
    weatherInfoEl.appendChild(cityNameEl);
    weatherInfoEl.appendChild(temperatureEl);
    weatherInfoEl.appendChild(humidityEl);
    weatherInfoEl.appendChild(windSpeedEl);

}

//function to get uv Index
var uvIndex = function(coOrds) {
    var latValue = coOrds.coord.lat;
    var lonValue = coOrds.coord.lon;
    var apiKey= "0d48ec19c1db5231554aa0ab7a864b07";
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latValue + "&lon=" + lonValue;

    //make a request to the url
    fetch(apiUrl).then(function(response){
        response.json().then(function(getUV){
            var uvValue = parseFloat(getUV.value);
            var uvEl = document.createElement("div");

            var uvPEl = document.createElement("p");
            uvPEl.textContent = "UV Index: "
            uvPEl.setAttribute("style", "display:inline");

            var uvP2El = document.createElement("p");
            uvP2El.textContent = uvValue;
            uvP2El.setAttribute("style", "display:inline");

            //append
            uvEl.appendChild(uvPEl);
            uvEl.appendChild(uvP2El);
            weatherInfoEl.appendChild(uvEl);

            if(uvValue >= 0 && uvValue <= 2.9) {
                uvP2El.classList = "low";
            }
            else if (uvValue >= 3.0 && uvValue <= 5.9) {
                uvP2El.classList = "moderate";
            }
            else if (uvValue >= 6.0 && uvValue <= 7.9) {
                uvP2El.classList = "high";
            }
            else if (uvValue >= 8.0 && uvValue <= 10.9) {
                uvP2El.classList = "very-high";
            }
            else if (uvValue >= 11.0) {
                uvP2El.classList = "extreme";
            }

            
        });
    });


}

//function to display the weekly forecast

var fiveForecast = function(forecast) {
    //get the 5 col elements
    var forecastCol1 = document.querySelector("#forecast-day1");
    forecastCol1.textContent = "";

    var forecastCol2 = document.querySelector("#forecast-day2");
    forecastCol2.textContent = "";

    var forecastCol3 = document.querySelector("#forecast-day3");
    forecastCol3.textContent = "";

    var forecastCol4 = document.querySelector("#forecast-day4");
    forecastCol4.textContent = "";

    var forecastCol5 = document.querySelector("#forecast-day5");
    forecastCol5.textContent = "";

    var weatherList = forecast.list;

    var today = moment().utc().startOf('day');
    
    //day one
    var dayOneUtc = moment(today).utc().add(1,"day").startOf('day');
    var dayOne =  moment(today).startOf('day').add(1, "day").format("MM/DD/YY");
    console.log(dayOne);
    var dayOneStart = moment(dayOneUtc).unix();
    var dayOneEnd = moment(dayOneUtc).endOf('day').unix();

    //day two
    var dayTwoUtc = moment(today).utc().add(2,"day").startOf('day');
    var dayTwo =  moment(today).startOf('day').add(2, "day").format("MM/DD/YY");
    console.log(dayTwo);
    var dayTwoStart = moment(dayTwoUtc).unix();
    var dayTwoEnd = moment(dayTwoUtc).endOf('day').unix();

    //day three
    var dayThreeUtc = moment(today).utc().add(3,"day").startOf('day');
    var dayThree =  moment(today).startOf('day').add(3, "day").format("MM/DD/YY");
    console.log(dayThree);
    var dayThreeStart = moment(dayThreeUtc).unix();
    var dayThreeEnd = moment(dayThreeUtc).endOf('day').unix();

    //day four
    var dayFourUtc = moment(today).utc().add(4,"day").startOf('day');
    var dayFour =  moment(today).startOf('day').add(4, "day").format("MM/DD/YY");
    console.log(dayFour);
    var dayFourStart = moment(dayFourUtc).unix();
    var dayFourEnd = moment(dayFourUtc).endOf('day').unix();

    //day five
    var dayFiveUtc = moment(today).utc().add(5,"day").startOf('day');
    var dayFive =  moment(today).startOf('day').add(5, "day").format("MM/DD/YY");
    console.log(dayFive);
    var dayFiveStart = moment(dayFiveUtc).unix();
    var dayFiveEnd = moment(dayFiveUtc).endOf('day').unix();

    //adding the text to the foracasts
    var forecastDay1 = document.createElement("h5");
    forecastDay1.textContent = dayOne;

    var forecastDay2 = document.createElement("h5");
    forecastDay2.textContent = dayTwo;

    var forecastDay3 = document.createElement("h5");
    forecastDay3.textContent = dayThree;

    var forecastDay4 = document.createElement("h5");
    forecastDay4.textContent = dayFour;

    var forecastDay5 = document.createElement("h5");
    forecastDay5.textContent = dayFive;

    var hour;

    //append
    forecastCol1.appendChild(forecastDay1);
    forecastCol2.appendChild(forecastDay2);
    forecastCol3.appendChild(forecastDay3);
    forecastCol4.appendChild(forecastDay4);
    forecastCol5.appendChild(forecastDay5);

    //console.log(weatherList);

   for (var i = 0; i < weatherList.length; i++) { 
            var value = weatherList[i].dt;
            var forecastDate;
            var forecastIcon;
            var forecastImg;
            var forecastTemp;
            var forecastHumidity;

            if(weatherList[i].dt >= dayOneStart && weatherList[i].dt <= dayOneEnd) {
                hour = moment(value, "X").format();
                var hourTZ = moment(hour).format('hh:mm A');

                forecastDate = document.createElement("p");
                forecastDate.textContent = hourTZ;
                forecastDate.setAttribute("style", "border-top: 1px white solid");
                forecastCol1.appendChild(forecastDate);

                forecastIcon = weatherList[i].weather[0].icon;
                forecastImg = document.createElement("img");
                forecastImg.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png" );
                forecastImg.classList = "forecastIcon";
                forecastCol1.appendChild(forecastImg);

                forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temp: " + weatherList[i].main.temp + "°F";
                forecastCol1.appendChild(forecastTemp);

                forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + weatherList[i].main.humidity + "%";
                forecastCol1.appendChild(forecastHumidity);  

            }
            else if (weatherList[i].dt >= dayTwoStart && weatherList[i].dt <= dayTwoEnd) {
                hour = moment(value, "X").format();
                var hourTZ = moment(hour).format('hh:mm A');

                forecastDate = document.createElement("p");
                forecastDate.textContent = hourTZ;
                forecastDate.setAttribute("style", "border-top: 1px white solid");
                forecastCol2.appendChild(forecastDate);

                forecastIcon = weatherList[i].weather[0].icon;
                forecastImg = document.createElement("img");
                forecastImg.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png" );
                forecastImg.classList = "forecastIcon";
                forecastCol2.appendChild(forecastImg);

                forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temp: " + weatherList[i].main.temp + "°F";
                forecastCol2.appendChild(forecastTemp);

                forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + weatherList[i].main.humidity + "%";
                forecastCol2.appendChild(forecastHumidity);  

            }
            else if (weatherList[i].dt >= dayThreeStart && weatherList[i].dt <= dayThreeEnd) {
                hour = moment(value, "X").format();
                var hourTZ = moment(hour).format('hh:mm A');

                forecastDate = document.createElement("p");
                forecastDate.textContent = hourTZ;
                forecastDate.setAttribute("style", "border-top: 1px white solid");
                forecastCol3.appendChild(forecastDate);

                forecastIcon = weatherList[i].weather[0].icon;
                forecastImg = document.createElement("img");
                forecastImg.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png" );
                forecastImg.classList = "forecastIcon";
                forecastCol3.appendChild(forecastImg);

                forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temp: " + weatherList[i].main.temp + "°F";
                forecastCol3.appendChild(forecastTemp);

                forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + weatherList[i].main.humidity + "%";
                forecastCol3.appendChild(forecastHumidity);  

            }
            else if (weatherList[i].dt >= dayFourStart && weatherList[i].dt <= dayFourEnd) {
                hour = moment(value, "X").format();
                var hourTZ = moment(hour).format('hh:mm A');

                forecastDate = document.createElement("p");
                forecastDate.textContent = hourTZ;
                forecastDate.setAttribute("style", "border-top: 1px white solid");
                forecastCol4.appendChild(forecastDate);

                forecastIcon = weatherList[i].weather[0].icon;
                forecastImg = document.createElement("img");
                forecastImg.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png" );
                forecastImg.classList = "forecastIcon";
                forecastCol4.appendChild(forecastImg);

                forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temp: " + weatherList[i].main.temp + "°F";
                forecastCol4.appendChild(forecastTemp);

                forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + weatherList[i].main.humidity + "%";
                forecastCol4.appendChild(forecastHumidity);  

            }
            else if (weatherList[i].dt >= dayFiveStart && weatherList[i].dt <= dayFiveEnd) {
                hour = moment(value, "X").format();
                var hourTZ = moment(hour).format('hh:mm A');

                forecastDate = document.createElement("p");
                forecastDate.textContent = hourTZ;
                forecastDate.setAttribute("style", "border-top: 1px white solid");
                forecastCol5.appendChild(forecastDate);

                forecastIcon = weatherList[i].weather[0].icon;
                forecastImg = document.createElement("img");
                forecastImg.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png" );
                forecastImg.classList = "forecastIcon";
                forecastCol5.appendChild(forecastImg);

                forecastTemp = document.createElement("p");
                forecastTemp.textContent = "Temp: " + weatherList[i].main.temp + "°F";
                forecastCol5.appendChild(forecastTemp);

                forecastHumidity = document.createElement("p");
                forecastHumidity.textContent = "Humidity: " + weatherList[i].main.humidity + "%";
                forecastCol5.appendChild(forecastHumidity);  

            }
    }
}

//function to render the search
var renderSearchCity = function(searchHistory) {
    console.log(searchHistory);
    searchHistoryEl.textContent = "";
    $.each(searchHistory, function (i) {
        var cityName = searchHistory[i];

        //dynamically creating the card
        var cityCard = $('<div>' + cityName + "</div>").attr('class', 'card text-center align-middle').attr("id", "cityName");
        searchHistoryEl.prepend(cityCard);
    });
}

//function for search history
var searchHistory = function() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));
    console.log(searchHistory);
    console.log(typeof searchHistory);
    if (typeof searchHistory === null) {
        alert("No cities saved in history");
    }
    else if (typeof searchHistory === "undefined") {
        alert("No cities saved in history");
    }
    else if (typeof searchHistory === 'string') {
        searchHistory = JSON.parse(searchHistory);
        renderSearchCity(searchHistory);
    }
    else {
        renderSearchCity(searchHistory);
    }

}
    
//function to add History to the searches
var addHistory = function(response) {
    var cityStorage = localStorage.getItem("city");
    var citySearched = response.name;
    console.log(cityStorage);
    console.log(citySearched);

    if (typeof (cityStorage) === null) {
        cityStorage = [];
        cityStorage.push(citySearched);
        localStorage.setItem("city", JSON.stringify(cityStorage))
        searchHistory()
    }
    else if (typeof (cityStorage) === "undefined") {
        cityStorage = [];
        cityStorage.push(citySearched);
        localStorage.setItem("city", JSON.stringify(cityStorage))
        searchHistory()
    }
    else if (typeof (cityStorage) === 'string') {
        cityStorage = JSON.parse(localStorage.getItem("city"));
        if (cityStorage.includes(citySearched)) {
            searchHistory()
        }
        else {
            cityStorage.push(citySearched);
            localStorage.setItem("city", JSON.stringify(cityStorage));
            searchHistory()
        }
    }
    else {
        cityStorage = JSON.parse(localStorage.getItem("city"));
        if (cityStorage.includes(citySearched)) {
            searchHistory()
        }
        else {
            cityStorage.push(response.name);
            localStorage.setItem("city", JSON.stringify(cityStorage));
            searchHistory()
        }
    }
}

//rendering default weather

var defaultWeather = function() {
    weatherInfoEl.textContent = "";
    var defaultWeather = JSON.parse(localStorage.getItem("city"));

    console.log(defaultWeather);

    var apiKey = "0d48ec19c1db5231554aa0ab7a864b07";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + defaultWeather[0] + "&units=imperial&appid=" + apiKey;
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + defaultWeather[0] + "&units=imperial&appid=" + apiKey;


    //make a request to the url
    fetch(apiUrl).then(function(defaultresponse){
        defaultresponse.json().then(function(defaultresponse){
            currentWeatherCondidtion(defaultresponse);
            uvIndex(defaultresponse);
            addHistory(defaultresponse);
        });
    });

    //make a request to the forecast url
    fetch(forecastUrl).then(function(response){
        response.json().then(function(forecast){
            fiveForecast(forecast);
        });
    });

}


searchBtnEl.addEventListener("click", getWeatherInfo);
cardEl.addEventListener("click", cardClick);
defaultWeather();