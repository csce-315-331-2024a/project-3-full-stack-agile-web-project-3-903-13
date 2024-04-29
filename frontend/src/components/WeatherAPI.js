import { useState, useEffect } from 'react';
import Image from "next/image";
import axios from 'axios';

const WeatherWidget = ( {onWeatherLoaded} ) => {
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [weatherIconUrl, setWeatherIconUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (location) {
            fetchWeatherData(location.latitude, location.longitude);
        }
    }, [location]);

    useEffect(() => {
        const weatherUpdateInterval = setInterval(() => {
            if (location) {
                fetchWeatherData(location.latitude, location.longitude);
            }
        }, 10000); // Update every 10 seconds
        return () => clearInterval(weatherUpdateInterval);
    }, [location]);

    // Format the date to display day of the week and date
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString();
    };

    // Format the time to display hours, minutes, and seconds
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    };

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
