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
import { fromLonLat } from 'ol/proj';
import axios from 'axios';

const DatabaseMap = () => {
  const [map, setMap] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch location data from the database
        const response = await axios.get('http://localhost:8000/api/getLocations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const mapInstance = new Map({
      target: 'database-map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource(),
        }),
      ],
      view: new View({
        center: fromLonLat([83.1258, 28.3974]),
        zoom: 10,
        maxZoom: 34,
        minZoom: 7,
      }),
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (map && locations.length > 0) {
      const vectorLayer = map.getLayers().getArray().find(layer => layer instanceof VectorLayer);
  
      if (vectorLayer) {
        // Clear existing features
        vectorLayer.getSource().clear();
  
        locations.forEach((location) => {
  const [lon, lat] = [parseFloat(location.longitude), parseFloat(location.latitude)];

  // Log the transformed coordinates
  const [transformedLon, transformedLat] = fromLonLat([lon, lat]);
  console.log('Location:', { lon, lat });
  console.log('Transformed Coordinates:', { transformedLon, transformedLat });
  console.log('Map View Center:', map.getView().getCenter());

  // Add a blue pin for each location
  vectorLayer.getSource().addFeature(
    new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'blue' }),
        }),
      }),
    })
  );
});
      }
    }
  }, [map, locations]);
  
  

  return (
    <div>
      <div id="database-map" style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
};

export default DatabaseMap;
