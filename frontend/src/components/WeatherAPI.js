import { useState, useEffect } from 'react';

const WeatherWidget = () => {
    const [weatherInfo, setWeatherInfo] = useState(null);

    useEffect(() => {
        // Function to fetch weather data based on user's location
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const apiKey = 'YOUR_OPENWEATHER_API_KEY';
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                const data = await response.json();

                // Extract relevant weather information
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const weatherDescription = data.weather[0].description;

                // Update weatherInfo state with weather data
                setWeatherInfo({
                    temperature,
                    humidity,
                    weatherDescription
                });
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
        <div>
            {weatherInfo ? (
                <div>
                    <p>Temperature: {weatherInfo.temperature} K</p>
                    <p>Humidity: {weatherInfo.humidity} %</p>
                    <p>Weather Condition: {weatherInfo.weatherDescription}</p>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default WeatherWidget;
