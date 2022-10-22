import { Route, Routes } from 'react-router-dom';

import { Home, Test } from '../pages';

export default function index() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/test' element={<Test />} />
    </Routes>
  );
}
