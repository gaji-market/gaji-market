import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useToast from 'hooks/toast';

import { setupSession, selectIsLoggedIn } from 'store/sessionSlice';

import Layout from 'layouts/Layout';
import LayoutWithoutBar from 'layouts/Layout_WithoutAppBar';

import {
  Home,
  Login,
  SignUp,
  ProductView,
  ProductDetailView,
  Editor,
  MyPage,
  MyEditPage,
  SearchPage,
  Chat,
} from 'pages';

import Splash from 'components/common/Splash';

export default function Router() {
  const splashRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [splashToggle, setSplashToggle] = useState(false);

  // init session
  dispatch(setupSession());

  useEffect(() => {
    // splash
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

  useEffect(() => {
    if (!isLoggedIn && location.pathname.includes('detail')) {
      addToast({
        isToastSuccess: true,
        isMainTheme: true,
        toastMessage: '로그인한 유저만 열람할 수 있습니다.',
      });
    }
  }, [location]);

  if (splashToggle) {
    return (
      <Routes>
        <Route path='/' element={<Splash refObj={splashRef} />} />
      </Routes>
    );
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        <Route element={<LayoutWithoutBar />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Route>

        <Route element={<Layout />}>
          <Route path='/products' element={<Outlet />}>
            <Route index element={<Navigate to='/products/pal' />} />
            <Route path=':type' element={<ProductView />} />
            <Route path=':type/detail/:id' element={<Navigate to='/login' />} />
          </Route>

          <Route path='/search' element={<SearchPage />} />
        </Route>

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />

        <Route path='/mypage' element={<MyPage />} />
        <Route path='/mypage/edit' element={<MyEditPage />} />

        <Route path='/write' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type' element={<Editor />} />
        </Route>

        <Route path='/modify' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type/:id' element={<Editor />} />
        </Route>

        <Route path='/products' element={<Outlet />}>
          <Route index element={<Navigate to='/products/pal' />} />
          <Route path=':type' element={<ProductView />} />
          <Route path=':type/detail/:id' element={<ProductDetailView />} />
        </Route>

        <Route path='/search' element={<SearchPage />} />

        <Route path='/chat' element={<Chat />} />
        <Route path='/chat/:id' element={<Chat />} />
      </Route>

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}
