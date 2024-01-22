import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';

const MapComponent = () => {
  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
      })
    });

    fetch('http://localhost:8000/api/getLocations')
      .then(response => response.json())
      .then(data => {
        data.forEach(location => {
          var marker = new Feature({
            geometry: new Point(fromLonLat([location.longitude, location.latitude]))
          });

          var vectorSource = new VectorSource({
            features: [marker]
          });

          var markerVectorLayer = new VectorLayer({
            source: vectorSource,
          });

          map.addLayer(markerVectorLayer);
        });
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
};

export default MapComponent;
