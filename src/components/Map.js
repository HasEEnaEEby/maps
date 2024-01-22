import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, transform } from 'ol/proj';
import axios from 'axios';

const OpenLayersMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const mapInstance = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([83.1258, 28.3974]),
        zoom: 3,
        maxZoom: 30,
        minZoom: 7.4,
      }),
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.dispose();
      }
    };
  }, []);

  const markerLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: 'red' }),
      }),
    }),
  });

  

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&countrycodes=NPL&bounded=1`
      );

      if (response.data.length > 0) {
        const result = response.data[0];
        const [lon, lat] = [parseFloat(result.lon), parseFloat(result.lat)];

        console.log('Destination Location:', { latitude: lat, longitude: lon });

        // Transform the coordinates to the map's projection
        const [transformedLon, transformedLat] = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');

        // Display the location in the box
        setSelectedLocation({
          name: result.display_name,
          longitude: transformedLon,
          latitude: transformedLat,
        });

        const isWithinBounds =
  transformedLon >= 8000000 && transformedLon <= 10000000 &&
  transformedLat >= 2500000 && transformedLat <= 3500000;


        console.log('Transformed Coordinates:', { transformedLon, transformedLat });

        if (isWithinBounds) {
          map.getView().animate({ center: [transformedLon, transformedLat], zoom: 6 });

          // Clear existing features from the markerLayer
          markerLayer.getSource().clear();

          // Add a new feature for the searched location
          markerLayer.getSource().addFeature(
            new Feature({
              geometry: new Point([transformedLon, transformedLat]),
            })
          );

          map.addLayer(markerLayer);
        } else {
          alert('We only guide you throughout Nepal.');
        }
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      alert('Error fetching geocoding data. Please try again.');
    }
  };

  const handleSetLocation = async () => {
    try {
      if (selectedLocation) {
        // Save the location to the database (using an API call)
        await axios.post('http://localhost:8000/api/saveLocation', {
          location_name: selectedLocation.name,
          longitude: selectedLocation.longitude,
          latitude: selectedLocation.latitude,
        });
  
        alert('Location saved successfully!');
      } else {
        alert('No location selected.');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location. Please try again.');
    }
  };
  

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {selectedLocation && (
        <div style={{ marginBottom: '10px' }}>
          <p>Name: {selectedLocation.name}</p>
          <p>Longitude: {selectedLocation.longitude}</p>
          <p>Latitude: {selectedLocation.latitude}</p>
          <button onClick={handleSetLocation}>Set in Map</button>
        </div>
      )}
      <div id="map" style={{ width: '100%', height: '800px' }}></div>
    </div>
  );
};

export default OpenLayersMap;
