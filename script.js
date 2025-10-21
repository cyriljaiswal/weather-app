const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".timelocation p:first-child");
const dateandtime = document.querySelector(".timelocation p:nth-child(2)");
const weekdayField = document.querySelector(".timelocation .weekday");
const conditionField = document.querySelector(".conditions p");
const searchField = document.querySelector(".searcharea");
const form = document.querySelector('form');

form.addEventListener('submit', searchForLocation);

let target = 'Mumbai';
let interval;

const codeMap = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Drizzle: Light", 53: "Drizzle: Moderate", 55: "Drizzle: Dense",
    56: "Freezing Drizzle: Light", 57: "Freezing Drizzle: Dense",
    61: "Rain: Slight", 63: "Rain: Moderate", 65: "Rain: Heavy",
    66: "Freezing Rain: Light", 67: "Freezing Rain: Heavy",
    71: "Snow fall: Slight", 73: "Snow fall: Moderate", 75: "Snow fall: Heavy",
    77: "Snow grains", 80: "Rain showers: Slight", 81: "Rain showers: Moderate", 82: "Rain showers: Violent",
    85: "Snow showers slight", 86: "Snow showers heavy",
    95: "Thunderstorm: Slight/moderate", 96: "Thunderstorm with hail: Slight", 99: "Thunderstorm with hail: Heavy"
};

async function fetchResults(targetLocation) {
    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetLocation)}&count=1`;
    let geoRes = await fetch(geoUrl);
    let geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
        resetDisplay();
        return;
    }

    const location = geoData.results[0];
    const lat = location.latitude;
    const lon = location.longitude;
    const name = location.name;
    const timezone = location.timezone;

    let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    let weatherRes = await fetch(weatherUrl);
    let weatherData = await weatherRes.json();

    if (weatherData.current_weather) {
        const temp = weatherData.current_weather.temperature;
        const weatherCode = weatherData.current_weather.weathercode;
        const condition = codeMap[weatherCode] || `Code ${weatherCode}`;
        updateDetails(temp, name, timezone, condition);
    } else {
        resetDisplay();
    }
}

function resetDisplay() {
    temperatureField.innerText = '--';
    locationField.innerText = 'Not found';
    dateandtime.innerText = '';
    weekdayField.innerText = '';
    conditionField.innerText = '';
    clearInterval(interval);
}

let interval;
function updateDetails(temp, locationName, timezone, condition) {
    temperatureField.innerText = temp + "°C";
    locationField.innerText = locationName;
    conditionField.innerText = condition;
    if (interval) clearInterval(interval);

    function showTime() {
        fetch(`https://api.open-meteo.com/v1/timezone?timezone=${encodeURIComponent(timezone)}`)
        .then(res => res.json())
        .then(data => {
            // Use current_time_unix (seconds since epoch)
            const localTime = new Date(data.current_time_unix * 1000);
            dateandtime.innerText = localTime.toLocaleString("en-US");
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            weekdayField.innerText = weekdays[localTime.getDay()];
        });
    }
    showTime();
    interval = setInterval(showTime, 1000);
}


function searchForLocation(e) {
    e.preventDefault();
    target = searchField.value;
    fetchResults(target);
}

fetchResults(target);

