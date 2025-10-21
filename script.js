const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".timelocation p:first-child");
const dateandtime = document.querySelector(".timelocation p:nth-child(2)");
const weekdayField = document.querySelector(".timelocation .weekday");
const conditionField = document.querySelector(".conditions p");
const searchField = document.querySelector(".searcharea");
const form = document.querySelector('form');

form.addEventListener('submit', searchForLocation);

let target = 'Mumbai'; // Default city

async function fetchResults(targetLocation) {
    // Get coordinates for city using Open-Meteo Geocoding API
    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetLocation)}&count=1`;
    let geoRes = await fetch(geoUrl);
    let geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
        temperatureField.innerText = '--';
        locationField.innerText = 'Not found';
        dateandtime.innerText = '';
        weekdayField.innerText = '';
        conditionField.innerText = '';
        return;
    }

    const location = geoData.results[0];
    const lat = location.latitude;
    const lon = location.longitude;
    const name = location.name;

    // Get weather data for those coordinates
    let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    let weatherRes = await fetch(weatherUrl);
    let weatherData = await weatherRes.json();

    // Show results
    if (weatherData.current_weather) {
        const temp = weatherData.current_weather.temperature;
        const time = weatherData.current_weather.time;
        const weatherCode = weatherData.current_weather.weathercode;
        // Basic mapping of weather code (see full legend at https://open-meteo.com/en/docs)
        const codeMap = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Drizzle: Light",
            53: "Drizzle: Moderate",
            55: "Drizzle: Dense",
            56: "Freezing Drizzle: Light",
            57: "Freezing Drizzle: Dense",
            61: "Rain: Slight",
            63: "Rain: Moderate",
            65: "Rain: Heavy",
            66: "Freezing Rain: Light",
            67: "Freezing Rain: Heavy",
            71: "Snow fall: Slight",
            73: "Snow fall: Moderate",
            75: "Snow fall: Heavy",
            77: "Snow grains",
            80: "Rain showers: Slight",
            81: "Rain showers: Moderate",
            82: "Rain showers: Violent",
            85: "Snow showers slight",
            86: "Snow showers heavy",
            95: "Thunderstorm: Slight/moderate",
            96: "Thunderstorm with hail: Slight",
            99: "Thunderstorm with hail: Heavy"
        };
        const condition = codeMap[weatherCode] || `Code ${weatherCode}`;

        let dateObj = new Date(time);
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let weekday = weekdays[dateObj.getDay()];

        updateDetails(temp, name, dateObj.toLocaleString(), condition, weekday);
    } else {
        temperatureField.innerText = '--';
        locationField.innerText = '--';
        dateandtime.innerText = '--';
        weekdayField.innerText = '--';
        conditionField.innerText = '--';
    }
}

function updateDetails(temp, locationName, time, condition, weekday) {
    temperatureField.innerText = temp + "°C";
    locationField.innerText = locationName;
    dateandtime.innerText = time;
    conditionField.innerText = condition;
    weekdayField.innerText = weekday;
}

function searchForLocation(e) {
    e.preventDefault();
    target = searchField.value;
    fetchResults(target);
}

fetchResults(target);
