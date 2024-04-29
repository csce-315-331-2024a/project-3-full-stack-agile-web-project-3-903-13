import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import WeatherWidget from '../src/components/WeatherAPI';

jest.mock('axios');
jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />);

describe('WeatherWidget', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<WeatherWidget />);
    const loadingText = screen.getByText('Loading weather data...');
    expect(loadingText).toBeInTheDocument();
  });

});
describe('getLocation', () => {
    beforeEach(() => {
      global.navigator.geolocation = {
        getCurrentPosition: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    test('calls getCurrentPosition when geolocation is supported', () => {
      const fetchWeatherData = jest.fn();
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              fetchWeatherData(latitude, longitude);
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };
  
      getLocation();
  
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });
  
    test('calls fetchWeatherData with correct latitude and longitude', async () => {
      const fetchWeatherData = jest.fn();
      const mockPosition = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };
  
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              fetchWeatherData(latitude, longitude);
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };
  
      navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => success(mockPosition));
  
      getLocation();
  
      await waitFor(() => {
        expect(fetchWeatherData).toHaveBeenCalledWith(37.7749, -122.4194);
      });
    });
  
    test('logs error when geolocation is not supported', () => {
      const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      global.navigator.geolocation = undefined;
  
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              fetchWeatherData(latitude, longitude);
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };
  
      getLocation();
  
      expect(consoleMock).toHaveBeenCalledWith('Geolocation is not supported by this browser.');
      consoleMock.mockRestore();
    });
  });
  