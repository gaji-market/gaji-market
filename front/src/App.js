import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppBar from './layouts/AppBar';
import Router from './routes';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppBar />
        <Router />
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
