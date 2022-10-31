import { Route, Routes } from 'react-router-dom';
import Layout from 'layouts/Layout';
import LayoutWithoutBar from 'layouts/Layout_WithoutAppBar';
import { Home, Login, Test, SliceTest, SignUp } from 'pages';

export default function index() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/test' element={<Test />} />
        <Route path='/test/slice' element={<SliceTest />} />
      </Route>
      <Route element={<LayoutWithoutBar />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Route>
    </Routes>
  );
}
