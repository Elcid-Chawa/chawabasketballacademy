import './App.css';
import BasketballAcademy from './components/BasketballAcademy';
import Footer from './components/Footer';
import Header from './components/Header';
import Sponsors from './components/Sponsors';

function App() {
  return (
    <div style={{backgroundImage: "/images/pageback.jpg"}}>
      <Header />
      <BasketballAcademy />
      <Sponsors />
      <Footer />
    </div>
    
  );
}

export default App;
