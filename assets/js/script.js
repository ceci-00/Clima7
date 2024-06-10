const APIKey = "087e373d130564b08c986c610e841dd0";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";

let city;
let temperature;
let humidity;
let wind;
let weather;
let date;
let name;


const cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

const saveCity = (city) => {
    if (cityHistory.includes(city)) {
        return;
    } else {
        cityHistory.push(city);
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        renderCityHistory();
    }
}

const renderCityHistory = () => {
    document.getElementById("city-history").innerHTML = "";
    for (let i = 0; i < cityHistory.length; i++) {
        const cityEl = document.createElement("button");
        cityEl.innerHTML = cityHistory[i];
        cityEl.addEventListener("click", () => getWeather(cityHistory[i]));
        document.getElementById("city-history").append(cityEl);
    }
}

renderCityHistory();

const getWeather = async (city) => {
    const response = await fetch(
        `${baseURL}${city}&appid=${APIKey}&units=imperial`
    );
    const data = await response.json();
    console.log(data);
    temperature = data.main.temp;
    date = data.dt;
    weather = data.weather[0].description;
    humidity = data.main.humidity;
    wind = data.wind.speed;
    name = data.name;
    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    console.log(temperature, date, weather, humidity, wind, name);
    document.getElementById("city-name").innerHTML = name;
    document.getElementById("date").innerHTML = dayjs.unix(date).format("MM/DD/YYYY");
    document.getElementById("temp").innerHTML = temperature+"°F";
    document.getElementById("hum").innerHTML = humidity+"%";
    document.getElementById("wind").innerHTML = wind+" mph";
    document.getElementById("icon").src = iconUrl;
    document.getElementById("icon").alt = weather;
    getForecast(data.coord.lat, data.coord.lon);
    }

const getForecast = async (lat, lon) => {
    const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
    const response = await fetch(apiUrlForecast);
    const data = await response.json();
    console.log(data);
    let forecast = data.list;

    for (let i = 3; i < forecast.length; i += 8) {
        const dateEl = document.createElement("p");
        const tempEl = document.createElement("p");
        const humEl = document.createElement("p");
        const windEl = document.createElement("p");
        const iconEl = document.createElement("img");
        const divEl = document.createElement("div");

        dateEl.innerHTML = dayjs.unix(forecast[i].dt).format("MM/DD/YYYY");
        tempEl.innerHTML = forecast[i].main.temp + "°F";
        humEl.innerHTML = forecast[i].main.humidity + "%";
        windEl.innerHTML = forecast[i].wind.speed + " mph";
        iconEl.src = `https://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png`;
        iconEl.alt = forecast[i].weather[0].description;
        divEl.append(dateEl, iconEl, tempEl, humEl, windEl);
        document.getElementById("forecast-container").append(divEl);
    }
}

const getCity = async () => {
    city = document.getElementById("city").value;
    getWeather(city);
    saveCity(city);
}

document.getElementById("submit").addEventListener("click", getCity);