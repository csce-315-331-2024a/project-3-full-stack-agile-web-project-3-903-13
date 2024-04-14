import { useState, useEffect } from 'react';
import Image from "next/image";

const WeatherWidget = () => {
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [weatherIconUrl, setWeatherIconUrl] = useState('');

    useEffect(() => {
        // Function to fetch weather data based on user's location
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const apiKey = '4a4358610dfaa3b0db4e33b4313a33f2';
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                const data = await response.json();
                console.log('Weather API response:', data);

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
                setWeatherIconUrl(`https://openweathermap.org/img/wn/${weatherIcon}.png`);
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
    }, []);

    return (
        <div className="flex items-center">
            {weatherIconUrl && <Image src={weatherIconUrl} alt="Weather Icon" width={50} height={50} className="mr-2"/>}
            <div>
                {weatherInfo && (
                    <>
                        <p className="font-bold">{weatherInfo.place}</p>
                        <p>{weatherInfo.temperatureF}°F |  {weatherInfo.weatherDescription}</p>
                    </>
                )}
                {!weatherInfo && <p>Loading weather data...</p>}
            </div>
        </div>
    );
};

export default WeatherWidget;
