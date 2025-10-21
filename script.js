// http://api.weatherapi.com/v1/current.json?key=e78fd94a43ca4f498a825019252110&q=mumbai&aqi=no


const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".timelocation p:first-child");
const dateandtime = document.querySelector(".timelocation p:nth-child(2)");
const weekdayField = document.querySelector(".timelocation .weekday");
const conditionField = document.querySelector(".conditions p");
const searchField = document.querySelector(".searcharea");
const form = document.querySelector('form');

form.addEventListener('submit', searchForLocation);

let target = 'Mumbai';

const fetchResults = async (targetLocation) => {
    let url = `https://api.weatherapi.com/v1/current.json?key=e78fd94a43ca4f498a825019252110&q=${targetLocation}&aqi=no`;

    const res = await fetch(url);
    const data = await res.json();

    let locationName = data.location.name;
    let time = data.location.localtime; // Example: "2025-10-21 10:40"
    let temp = data.current.temp_c;
    let condition = data.current.condition.text;

    // Extract weekday name from localtime string
    let dateObj = new Date(time.replace(' ', 'T'));
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekday = weekdays[dateObj.getDay()];

    updateDetails(temp, locationName, time, condition, weekday);
};

function updateDetails(temp, locationName, time, condition, weekday) {
    temperatureField.innerText = temp + "°C";
    locationField.innerText = locationName;
    dateandtime.innerText = time;
    conditionField.innerText = condition;
    weekdayField.innerText = weekday; // show day
}

function searchForLocation(e) {
    e.preventDefault();
    target = searchField.value;
    fetchResults(target);
}

fetchResults(target);


