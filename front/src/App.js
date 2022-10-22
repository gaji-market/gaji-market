import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
