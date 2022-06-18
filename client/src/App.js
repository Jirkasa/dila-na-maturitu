import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';

function App() {
	return (
		<Routes>
			<Route path="*" element={
				<div>Not Found</div>
			}/>
			<Route exact path="/" element={
				<Home/>
			}/>
			<Route exact path="/registrace" element={
				<Registration/>
			}/>
			<Route exact path="/prihlaseni" element={
				<Login/>
			}/>
		</Routes>
	);
}

export default App;
