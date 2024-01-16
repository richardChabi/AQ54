import logoData354 from './logoData354.png';
import './App.css';
import AirQualityComponent from './AirQualityComponent';
import HourlyAvgComponent from './HourlyAvgComponent';
import GetRangeComponent from './GetRangeComponent';
import Sidebar from './SideBar';

function App() {
  return (
    <div>
       <header style={headerStyle}>
        <img src={logoData354} style ={logoStyle} alt="logo" />
      </header>
      <Sidebar/>
      <div style ={ComponentStyle}>
        <HourlyAvgComponent/>
      </div>
      <div style ={ComponentStyle}>
        <AirQualityComponent />
      </div>
      <div style ={ComponentStyle}>
        <GetRangeComponent/>
      </div>
      
    </div>
  );
}

const ComponentStyle ={
  marginTop:'20px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80px', // Ajustez la hauteur selon vos besoins
  backgroundColor: '#333', // Ajoutez une couleur de fond si nécessaire
  position: 'fixed',
  top: '0',
  width: '100%',
};

const logoStyle ={
  width:'200px',
  height:'50px',
  marginTop:'110px',
  marginBottom:'100px'
}



export default App;
