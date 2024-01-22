import './App.css';
import DatabaseMap from './client/databasemap';
import OpenLayersMap from './components/Map';
import MapComponent from './components/page';


// App.js or App.css
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>OpenLayers Map</h1>
      </header>
      <main style={{ width: 'auto',margin:'10px' }}>
        <OpenLayersMap />

        <h1> Client Site </h1>
        {/* <DatabaseMap/> */}
        <MapComponent/>
      </main>
    </div>
  );
}


export default App;

