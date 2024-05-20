const apiKey = "a2f5f863fcff8480bf3e49030d71e204";
const currentDate = new Date();

// DOM elements
const pres_timeEl = document.querySelector(".pres_time");
const today_dateEl = document.querySelector(".today_date");
const curr_locEL = document.querySelector(".curr_loc");
const lat_lonEl = document.querySelector(".lat_lon");
const pres_imgEl = document.querySelector(".pres_img");
const about_tempEl = document.querySelector(".about_temp");
const pres_tempEl = document.querySelector(".pres_temp");
const feels_like_infoEl = document.querySelector(".feels_like_info");
const humidity_infoEl = document.querySelector(".humidity_info");
const sunrise_infoEl = document.querySelector(".sunrise_info");
const sunset_infoEl = document.querySelector(".sunset_info");
const visibility_infoEl = document.querySelector(".visibility_info");
const windspeed_infoEl = document.querySelector(".windspeed_info");
const input_loc = document.querySelector(".search_input");
const search_btn = document.querySelector(".search_btn");

// Helper function to format time
function formatTime(utc) {
  const date = new Date(utc * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

// Helper function to fetch weather data
function fetchWeather(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      curr_locEL.textContent = data.timezone;
      lat_lonEl.textContent = `${data.lat}°N ${data.lon}°E`;
      pres_imgEl.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
      );
      about_tempEl.textContent = data.current.weather[0].main;
      pres_tempEl.textContent = `${data.current.temp} °C`;
      feels_like_infoEl.textContent = `${data.current.feels_like} °C`;
      humidity_infoEl.textContent = `${data.current.humidity} %`;
      sunrise_infoEl.textContent = formatTime(data.current.sunrise) + " AM";
      sunset_infoEl.textContent = formatTime(data.current.sunset) + " PM";
      visibility_infoEl.textContent = `${data.current.visibility / 1000} Km`;
      windspeed_infoEl.textContent = `${data.current.wind_speed} m/s`;

      // Iterate through the next days
      const dayElements = document.querySelectorAll(".day_next");
      dayElements.forEach((dayElement, index) => {
        const dailyData = data.daily[index];
        const dayIndex = (currentDate.getDay() + index + 1) % 7;
        dayElement
          .querySelector(".dn_img")
          .setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png`
          );
        dayElement.querySelector(".day").textContent = currentDay[dayIndex];
        dayElement.querySelector(
          ".dn_day_temp"
        ).textContent = `Day - ${dailyData.temp.day} °C`;
        dayElement.querySelector(
          ".dn_night_temp"
        ).textContent = `Night - ${dailyData.temp.night} °C`;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Fetch weather based on geolocation or default location
function fetchWeatherByLocation(latitude, longitude) {
  fetchWeather(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts,hourly&appid=${apiKey}&units=metric`
  );
}

// Fetch weather based on user input location
function fetchWeatherByInput() {
  const placeName = input_loc.value;
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${placeName}&limit=5&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      fetchWeather(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=minutely,alerts,hourly&appid=${apiKey}&units=metric`
      );
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Update time every second
setInterval(function () {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const hoursIn12 = hours % 12 < 10 ? "0" + (hours % 12) : hours % 12;
  const minLess10 = minutes < 10 ? "0" + minutes : minutes;
  const AmPm = hours < 12 ? "AM" : "PM";
  pres_timeEl.innerHTML = `${
    hoursIn12 == 0 ? "12" : hoursIn12
  } : ${minLess10} <span class="AmPm">${AmPm}</span>`;
}, 1000);

// Display today's date
const currentDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const currentMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentDayInNum = currentDate.getDay();
const currentDatee = currentDate.getDate();
const currentMonthInNum = currentDate.getMonth();
today_dateEl.textContent = `${currentDay[currentDayInNum]}, ${currentDatee} ${currentMonth[currentMonthInNum]}`;

// Check geolocation support
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetchWeatherByLocation(latitude, longitude);
    },
    (error) => {
      console.error("Error getting location:", error.message);
      // document.querySelector(".error").style.display = "block";
      fetchWeatherByLocation(28.7041, 77.1025); // Default location
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

// Event listener for search button
search_btn.addEventListener("click", fetchWeatherByInput);
