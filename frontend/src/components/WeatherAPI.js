import { useState, useEffect } from 'react';
import Image from "next/image";
import axios from 'axios';

/**
 * Displays current weather information using the user's location.
 * @module WeatherWidget
 * @param {Object} props - Component props.
 * @param {function} props.onWeatherLoaded - Callback function to handle when the weather data is loaded.
 */
const WeatherWidget = ( {onWeatherLoaded} ) => {
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [weatherIconUrl, setWeatherIconUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState(null);

    /**
     * Updates the current time every second.
     * @private
     * @memberOf module:WeatherWidget
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);

    /**
     * Fetches weather data whenever the location changes.
     * @private
     * @memberOf module:WeatherWidget
     */
    useEffect(() => {
        if (location) {
            fetchWeatherData(location.latitude, location.longitude);
        }
    }, [location]);

    /**
     * Updates weather data every 10 seconds based on the current location.
     * @private
     * @memberOf module:WeatherWidget
     */
    useEffect(() => {
        const weatherUpdateInterval = setInterval(() => {
            if (location) {
                fetchWeatherData(location.latitude, location.longitude);
            }
        }, 10000); // Update every 10 seconds
        return () => clearInterval(weatherUpdateInterval);
    }, [location]);

    /**
     * Formats a date to a readable string.
     * @private
     * @memberOf module:WeatherWidget
     * @param {Date} date - The date to format.
     * @return {string} - A formatted date string.
     */
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString();
    };

    /**
     * Formats time to be more human-readable.
     * @private
     * @memberOf module:WeatherWidget
     * @param {Date} date - The time to format.
     * @return {string} - A formatted time string.
     */
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    };

    /**
     * Fetches weather data from the OpenWeatherMap API.
     * @private
     * @memberOf module:WeatherWidget
     * @param {number} latitude - Latitude of the location.
     * @param {number} longitude - Longitude of the location.
     */
    const fetchWeatherData = async (latitude, longitude) => {
        try {
            const apiKey = '4a4358610dfaa3b0db4e33b4313a33f2';
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
            const data = response.data;
            const place = data.name;
            const temperature = data.main.temp;
            const temperatureF = ((temperature - 273.15) * 9 / 5 + 32).toFixed(0);
            const weatherDescription = data.weather[0].main;
            const weatherIcon = data.weather[0].icon;

            setWeatherInfo({
                place,
                temperatureF,
                weatherDescription
            });
            setWeatherIconUrl(`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`);
            onWeatherLoaded(parseFloat(temperatureF));
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    /**
     * Watches the user's geolocation and updates location state.
     * @private
     * @memberOf module:WeatherWidget
     */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(position => {
                const { latitude, longitude } = position.coords;
                if (!location || latitude !== location.latitude || longitude !== location.longitude) {
                    setLocation({ latitude, longitude });
                }
            }, error => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <div className="flex items-center w-full justify-center pb-8" role="region" aria-label="Weather Information">
            {weatherIconUrl && <Image src={weatherIconUrl} alt="Weather Icon" width={150} height={150} className="mr-2"/>}
            <div>
                {weatherInfo && (
                    <>
                        <p className="font-bold">{weatherInfo.place}</p>
                        <p>{formatDate(currentTime)} {formatTime(currentTime)}</p>
                        <p>{weatherInfo.temperatureF}°F |  {weatherInfo.weatherDescription}</p>
                    </>
                )}
                {!weatherInfo && <p>Loading weather data...</p>}
            </div>
        </div>
    );
};

export default WeatherWidget;
