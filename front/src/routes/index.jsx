import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import Layout from 'layouts/Layout';
import LayoutWithoutBar from 'layouts/Layout_WithoutAppBar';
import {
  Home,
  Login,
  Test,
  SliceTest,
  SignUp,
  ProductView,
  ProductDetailView,
  Editor,
  Error,
  MyPage,
} from 'pages';

export default function index() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/test' element={<Test />} />
        <Route path='/test/slice' element={<SliceTest />} />

        <Route path='/write' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type' element={<Editor />} />
        </Route>

        <Route path='/products' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type' element={<ProductView />} />
          <Route path=':type/detail/:id' element={<ProductDetailView />} />
        </Route>
        <Route path='mypage' elements={<MyPage />} />
      </Route>

      <Route element={<LayoutWithoutBar />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Route>
      <Route path='*' element={<Error />} />
    </Routes>
  );
}
