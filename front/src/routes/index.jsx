import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';

import Layout from 'layouts/Layout';
import LayoutWithoutBar from 'layouts/Layout_WithoutAppBar';

import {
  Home,
  Login,
  SliceTest,
  SignUp,
  ProductView,
  ProductDetailView,
  Editor,
  Error,
  MyPage,
  MyEditPage,
  Test,
  Chat,
} from 'pages';

import Splash from 'components/common/Splash';

export default function Router() {
  const splashRef = useRef(null);
  const location = useLocation();
  const [splashToggle, setSplashToggle] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setSplashToggle(true);
      if (splashRef.current) {
        splashRef.current.className = 'fade-out';
      }
      setTimeout(() => {
        setSplashToggle(false);
      }, 2000);
    }
  }, []);

  if (splashToggle) {
    return (
      <Routes>
        <Route path='/' element={<Splash refObj={splashRef} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/test' element={<Test />} />
        <Route path='/test/slice' element={<SliceTest />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/mypage/edit' element={<MyEditPage />} />

        <Route path='/write' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type' element={<Editor />} />
        </Route>

        <Route path='/products' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type' element={<ProductView />} />
          <Route path=':type/detail/:id' element={<ProductDetailView />} />
        </Route>
        <Route path='/chat' element={<Chat />} />
      </Route>

      <Route element={<LayoutWithoutBar />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Route>

      <Route path='*' element={<Error />} />
    </Routes>
  );
}
