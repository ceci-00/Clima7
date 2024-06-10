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
        const cityName = cityHistory[i].trim(); // Trim any leading/trailing whitespace
        if (cityName !== "") { // Check if the city name is not an empty string
            const cityEl = document.createElement("button");
            cityEl.innerHTML = cityName;
            cityEl.addEventListener("click", () => getWeather(cityName));
            cityEl.style.width = "100%";
            cityEl.style.backgroundColor = "#6c757d";
            cityEl.style.color = "#fff";
            cityEl.style.padding = "0.5rem";
            cityEl.style.borderRadius = "0.25rem";
            cityEl.style.fontSize = "1rem";
            cityEl.classList.add("mb-2");
            document.getElementById("city-history").append(cityEl);
        }
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

    // Clear the previous forecast data
    document.getElementById("forecast-container").innerHTML = "";

    for (let i = 3; i < forecast.length; i += 8) {
        const cardEl = document.createElement("div");
        const cardBodyEl = document.createElement("div");
        const dateEl = document.createElement("h5");
        const iconEl = document.createElement("img");
        const tempEl = document.createElement("p");
        const humEl = document.createElement("p");
        const windEl = document.createElement("p");

        cardEl.classList.add("card", "bg-secondary", "text-white", "mb-3", "col-12", "col-sm-6", "col-md-4", "col-lg-2", "mx-auto"); // Add the mx-auto class
        cardBodyEl.classList.add("card-body");
        dateEl.classList.add("card-title");
        dateEl.innerHTML = dayjs.unix(forecast[i].dt).format("MM/DD/YYYY");
        tempEl.classList.add("card-text");
        tempEl.innerHTML = forecast[i].main.temp + "°F";
        humEl.classList.add("card-text");
        humEl.innerHTML = "Humidity: " + forecast[i].main.humidity + "%";
        windEl.classList.add("card-text");
        windEl.innerHTML = "Wind: " + forecast[i].wind.speed + " mph";
        iconEl.src = `https://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png`;
        iconEl.alt = forecast[i].weather[0].description;

        cardBodyEl.append(dateEl, iconEl, tempEl, humEl, windEl);
        cardEl.append(cardBodyEl);
        document.getElementById("forecast-container").append(cardEl);
    }
}

const getCity = async () => {
    city = document.getElementById("city").value;
    getWeather(city);
    saveCity(city);
}

document.getElementById("submit").addEventListener("click", getCity);