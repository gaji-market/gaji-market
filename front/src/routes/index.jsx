import { Route, Routes } from 'react-router-dom';
import Layout from '../layouts/Layout';

import { Home, Login, Test } from '../pages';

export default function index() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path='/' element={<Home />} />
				<Route path='/test' element={<Test />} />
				<Route path='/login' element={<Login />} />
			</Route>
		</Routes>
	);
}
