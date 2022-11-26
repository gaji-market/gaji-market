import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'layouts/Layout';
import LayoutWithoutBar from 'layouts/Layout_WithoutAppBar';
import ProductDetailView from '../pages/ProductDetailView';
import {
  Home,
  Login,
  Test,
  SliceTest,
  SignUp,
  ProductView,
  Editor,
} from 'pages';

export default function index() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/test' element={<Test />} />
        <Route path='/test/slice' element={<SliceTest />} />
        <Route path='/products' element={<Navigate to='/products/pal' />} />
        <Route path='/products/:type' element={<ProductView />} />
        <Route path='/products/detail' element={<ProductDetailView />} />
        <Route path='/write' element={<Editor />} />
      </Route>
      <Route element={<LayoutWithoutBar />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Route>
    </Routes>
  );
}
