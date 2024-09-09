let api_key = ${{ vars.WEATHER_API_KEY }};
let video = document.querySelector('video');
let locIcon = document.getElementById("location-icon");
let search = document.getElementById("search-icon");
let cityInput = document.getElementById("city-input");
let displayCity = document.getElementById("city")
let temp = document.getElementById("temp");
let tempScale = document.getElementById("temp-scale");
let minTemp = document.getElementById("min");
let maxTemp = document.getElementById("max");
let condition = document.getElementById("condition");
let initialText = document.getElementById("initial-text");
let icon = document.getElementById("weather-icon");
let forecast_list = document.getElementsByClassName("forecast-list")[0];
let forecastDiv = document.getElementsByClassName("forecast")[0];


let get_weather_data = () => {
    if (cityInput.value !== '') {
        let city = cityInput.value
        let weather_link = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=2&aqi=no&alerts=no`
        fetch_data(weather_link);
    }
    else {
        alert('Please Enter a City');
    }
}

let fetch_data = (weather_link) => {
    fetch(weather_link)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            cityInput.value = '';
            // console.log(data);
            let current = data.current;
            let forecast = data.forecast;
            let location = data.location;
            let currentTime = current.last_updated.slice(-5, -3);
            console.log(current);
            let temperature = current.temp_c;
            let weatherText = current.condition.text;
            let weatherIcon = current.condition.icon;
            maxTemp.innerText = `Max: ${forecast.forecastday[0].day.maxtemp_c} ⁰C`;
            minTemp.innerText = `Min: ${forecast.forecastday[0].day.mintemp_c} ⁰C`;
            tempScale.innerText = '⁰C';
            initialText.innerHTML = '';
            // console.log(forecast);
            temp.innerText = temperature;
            condition.innerText = weatherText;
            icon.src = weatherIcon;
            // console.log(location);
            displayCity.innerHTML = '<i class="fa-solid fa-location-dot"></i>';
            displayCity.innerHTML += `<span id="city-name">${location.name}</span>`;

            let hourly_data = forecast.forecastday[0].hour;
            // console.log(hourly_data);
            forecast_list.innerHTML = '';

            for (h in hourly_data) {
                hour = hourly_data[h];
                // console.log(hour);
                let hourTime = hour.time.slice(-5, -3);
                if (hourTime >= currentTime) {
                    let forecastTime = hour.time.slice(-5);
                    let forecastIcon = hour.condition.icon;
                    let forecastTemp = hour.temp_c;
                    let li = create_li(forecastTime, forecastIcon, forecastTemp);
                    li.classList.add("forecast-item");
                    forecast_list.appendChild(li);
                }
            }

            let hourly_data2 = forecast.forecastday[1].hour;
            // console.log(hourly_data);

            for (h in hourly_data2) {
                hour = hourly_data2[h];
                // console.log(hour);
                let hourTime = hour.time.slice(-5, -3);
                if (hourTime <= currentTime) {
                    let forecastTime = hour.time.slice(-5);
                    let forecastIcon = hour.condition.icon;
                    let forecastTemp = hour.temp_c;
                    let li = create_li(forecastTime, forecastIcon, forecastTemp);
                    li.classList.add("forecast-item");
                    forecast_list.appendChild(li);
                }
            }

            if(weatherText.toLowerCase().includes('sunny') || weatherText.toLowerCase().includes('clear')) {
                console.log("Sunny");
                video.src = 'sunny.mp4';
            }
            else if(weatherText.toLowerCase().includes('cloud') || weatherText.toLowerCase().includes('mist')) {
                console.log("Cloudy");
                video.src = 'cloudy.mp4';
            }
            else if(weatherText.toLowerCase().includes('rain') || weatherText.toLowerCase().includes('thunder')) {
                console.log("Rainy");
                video.src = 'rainy.mp4';
            }
            else if(weatherText.toLowerCase().includes('snow')) {
                console.log("Snow");
                video.src = 'snow.mp4';
            }
            else {
                console.log("None");
                video.src = '';
            }

            forecastDiv.style.borderTop = "1px solid #929292";
        })
        .catch((e) => {
            show_error(e);
        });
}

let create_li = (time, img, temperature) => {
    let li = document.createElement('li');
    let forecastTime = document.createElement('span');
    forecastTime.classList.add("forecast-time");
    forecastTime.innerText = time;
    li.appendChild(forecastTime);
    let forecastIcon = document.createElement('img');
    forecastIcon.classList.add("forecast-icons");
    forecastIcon.src = img;
    li.appendChild(forecastIcon);
    let forecastTemp = document.createElement('span');
    forecastTemp.classList.add("forecast-temp");
    forecastTemp.innerText = `${temperature} ⁰C`;
    li.appendChild(forecastTemp);
    return li;
}

let show_error = (e) => {
    console.log(`An Error Occurred: ${e}`)
};

locIcon.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Success callback
                // console.log('Latitude:', position.coords.latitude);
                // console.log('Longitude:', position.coords.longitude);
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                let weather_link = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=2&aqi=no&alerts=no`;
                fetch_data(weather_link);
            },
            function(error) {
                // Error callback
                console.error('Error getting location:', error);
            }
        );
    }
    else {
        console.log('Geolocation is not supported by this browser.');
    }  
});

search.addEventListener('click', () => {
    get_weather_data();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        get_weather_data();
});

let scroll = 0;
forecast_list.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
        // e.preventDefault();
        // scroll = forecast_list.scrollLeft;
        if(scroll + e.deltaY < 0)
            scroll = 0;
        else if(scroll + e.deltaY > forecast_list.scrollWidth)
            scroll = forecast_list.scrollWidth;
        else
            scroll += e.deltaY;

        forecast_list.scrollTo({
            left: scroll,
            behavior: 'smooth'
        });
        // forecast_list.scrollLeft += e.deltaY;
        // console.log(forecast_list.scrollWidth);
    }
});

video.addEventListener('contextmenu' ,(e) => {
    e.preventDefault();
});
