const APIKey = "087e373d130564b08c986c610e841dd0";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";

let city;
let temperature;
let humidity;
let wind;
let weather;
let date;
let name;


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

const getCity = async () => {
    city = document.getElementById("city").value;
    getWeather(city);

}

document.getElementById("submit").addEventListener("click", getCity);