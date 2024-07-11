document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "RwTigWznRzK33umV7LStn8A2RRjFCEN7"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const temperatureDiv = document.getElementById("temperature");
    const hourlyForecastDiv = document.getElementById("hourlyForecast");
    const dailyForecastDiv = document.getElementById("5dayForecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    displayError("City not found.");
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                displayError("Error fetching location data.");
            });
    }

    function fetchWeatherData(locationKey) {
        const currentUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    displayError("No current weather data available.");
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                displayError("Error fetching current weather data.");
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const currentWeatherContent = `
            <h2>Current Temperature</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        temperatureDiv.innerHTML = currentWeatherContent;
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(hourlyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    displayError("No hourly forecast data available.");
                }
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                displayError("Error fetching hourly forecast data.");
            });
    }

    function displayHourlyForecast(data) {
        let hourlyForecastContent = `<h2>Hourly Forecast</h2>`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString();
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            hourlyForecastContent += `
                <p>${time} - Temperature: ${temperature}°C, Weather: ${weather}</p>
            `;
        });
        hourlyForecastDiv.innerHTML = hourlyForecastContent;
    }

    function fetchDailyForecast(locationKey) {
        const dailyUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(dailyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    displayError("No daily forecast data available.");
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                displayError("Error fetching daily forecast data.");
            });
    }

    function displayDailyForecast(dailyForecasts) {
        let dailyForecastContent = `<h2>5-Day Forecast</h2>`;
        dailyForecasts.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const minTemperature = day.Temperature.Minimum.Value;
            const maxTemperature = day.Temperature.Maximum.Value;
            const dayWeather = day.Day.IconPhrase;
            const nightWeather = day.Night.IconPhrase;
            dailyForecastContent += `
                <p>${date}</p>
                <p>Min Temperature: ${minTemperature}°C, Max Temperature: ${maxTemperature}°C</p>
                <p>Day Weather: ${dayWeather}</p>
                <p>Night Weather: ${nightWeather}</p>
            `;
        });
        dailyForecastDiv.innerHTML = dailyForecastContent;
    }

    function displayError(message) {
        temperatureDiv.innerHTML = `<p>${message}</p>`;
        hourlyForecastDiv.innerHTML = '';
        dailyForecastDiv.innerHTML = '';
    }
});
