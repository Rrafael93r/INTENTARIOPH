import { AppRutas } from './Rutas/AppRutas';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './estilos.css';
import ChatComponent from './components/Chat/ChatComponent';

function App() {
  return (
    <>
      <AppRutas />
      <ChatComponent />
    </>
  );
}
export default App;