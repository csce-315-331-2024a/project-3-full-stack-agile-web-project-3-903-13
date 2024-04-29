import { useState, useEffect } from 'react';
import Image from "next/image";
import axios from 'axios';

const WeatherWidget = ( {onWeatherLoaded} ) => {
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [weatherIconUrl, setWeatherIconUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Format the date to display day of the week and date
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString();
    };

    // Format the time to display hours, minutes, and seconds
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    };

    useEffect(() => {
        // Function to fetch weather data based on user's location
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const apiKey = '4a4358610dfaa3b0db4e33b4313a33f2';
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                const data = response.data;

                // Extract relevant weather information
                const place = data.name;
                const temperature = data.main.temp;
                const temperatureF = ((temperature - 273.15) * (9 / 5) + 32).toFixed(0);
                const weatherDescription = data.weather[0].main;
                const weatherIcon = data.weather[0].icon;

                // Update weatherInfo state with weather data
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

        // Function to get user's current location
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchWeatherData(latitude, longitude);
                }, error => {
                    console.error('Error getting location:', error);
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        // Fetch weather data when component mounts
        getLocation();
    }, [onWeatherLoaded]);

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
