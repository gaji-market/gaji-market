import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './store/store';

import Router from 'routes';
import ScrollTop from 'routes/scrollTop';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollTop />
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
