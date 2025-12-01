import logo from './logo.svg';
import './App.css';
import Routing from './routes/Routing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <Routing />
      <ToastContainer />
    </>
  );
}

export default App;
