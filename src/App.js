import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import img01d from "./assets/01d.svg";
import img01n from "./assets/01n.svg";
import img02d from "./assets/02d.svg";
import img02n from "./assets/02n.svg";
import img03d from "./assets/03d.svg";
import img03n from "./assets/03n.svg";
import img04d from "./assets/04d.svg";
import img04n from "./assets/04n.svg";
import img09d from "./assets/09d.svg";
import img09n from "./assets/09n.svg";
import img10d from "./assets/10d.svg";
import img10n from "./assets/10n.svg";
import img11d from "./assets/11d.svg";
import img11n from "./assets/11n.svg";
import img13d from "./assets/13d.svg";
import img13n from "./assets/13n.svg";
import imgDefault from "./assets/default.svg";

function App() {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [error, setError] = useState(null);

  let dateNow = new Date();
  let formattedDate = () => {
    let month = dateNow.toLocaleString("en", { month: "short" });
    let day = dateNow.getDate();
    let year = dateNow.getFullYear();
    let hour = dateNow.getHours();
    let minute = dateNow.getMinutes();
    let amOrPm = hour >= 12 ? "pm" : "am";

    let dayWithSuffix =
      day +
      (day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th");

    return `${month} ${dayWithSuffix} ${year} | ${hour}:${
      minute < 10 ? "0" : ""
    }${minute} ${amOrPm}`;
  };

  function fahrToCelsConverter(temp) {
    return Math.round((temp - 273.15) * 10) / 10;
  }

  useEffect(() => {
    const fetchCityName = (latitude, longitude) => {
      axios
        .get(
          `https://api.api-ninjas.com/v1/reversegeocoding?lat=${latitude}&lon=${longitude}&X-Api-Key=${process.env.REACT_APP_API_NINJAS_API_KEY}`
        )
        .then((res) => {
          setCity(res.data[0].name);
        })
        .catch((err) => {
          console.log(err);
          setError("An error occurred. Please try again.");
        });
    };

    const fetchWeatherData = (latitude, longitude) => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
        )
        .then((res) => {
          setWeather(res.data);
          fetchCityName(latitude, longitude);
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 429) {
            setError("Too many requests. Please try again later.");
          } else {
            setError("An error occurred. Please try again.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setError("Error getting user location. Please try again.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (weather.weather && weather.weather.length > 0) {
      switch (weather.weather[0].icon) {
        case "01d":
          setIconUrl(img01d);
          break;
        case "01n":
          setIconUrl(img01n);
          break;
        case "02d":
          setIconUrl(img02d);
          break;
        case "02n":
          setIconUrl(img02n);
          break;
        case "03d":
          setIconUrl(img03d);
          break;
        case "03n":
          setIconUrl(img03n);
          break;
        case "04d":
          setIconUrl(img04d);
          break;
        case "04n":
          setIconUrl(img04n);
          break;
        case "09d":
          setIconUrl(img09d);
          break;
        case "09n":
          setIconUrl(img09n);
          break;
        case "10d":
          setIconUrl(img10d);
          break;
        case "10n":
          setIconUrl(img10n);
          break;
        case "11d":
          setIconUrl(img11d);
          break;
        case "11n":
          setIconUrl(img11n);
          break;
        case "13d":
          setIconUrl(img13d);
          break;
        case "13n":
          setIconUrl(img13n);
          break;
        default:
          setIconUrl(imgDefault);
      }
    }
  }, [weather.weather]);

  if (loading) {
    return (
      <div>
        <p className="loading-text">
          Please enable location to display local weather.
        </p>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  let { temp, temp_min, temp_max } = weather.main;
  let { description } = weather.weather[0];

  return (
    <div className="App">
      <div className="app-container">
        <div className="title">
          <h1 className="app-title english">Weather App</h1>
        </div>
        <div className="content">
          <div className="top-part">
            <div className="city-name">{loading ? "loading.." : city}</div>
            <div className="date">
              {loading ? "loading.." : formattedDate()}
            </div>
          </div>
          <div className="body-part">
            <div className="weather-info">
              <div className="temperature">
                <span>
                  {loading ? "loading.." : fahrToCelsConverter(temp)}°
                </span>
              </div>
              <div className="weather-description">
                {loading ? "loading.." : description} 🙂
              </div>
              <div className="weather-max-min">
                min: {loading ? "loading.." : fahrToCelsConverter(temp_min)}°{" "}
                <span className="divider"> | </span>
                max: {loading ? "loading.." : fahrToCelsConverter(temp_max)}°
              </div>
            </div>
            <div className="weather-illustration">
              <img className="img" src={iconUrl} alt="weather illustration" />
            </div>
          </div>
        </div>
      </div>
      {/* Created by: Alaa Tahhan */}
      <div className="footer">
        <p className="footer-text">
          Created by:{" "}
          <a
            href="https://alaatahhan.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Alaa Tahhan
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
