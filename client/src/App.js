import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import Registration from './pages/Registration/Registration';
import NoUser from './route-guards/NoUser';

// todo - create not found page
function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="*" element={
					<div>Not Found</div>
				}/>
				<Route exact path="/" element={
					<Home/>
				}/>
				<Route exact path="/registrace" element={
					<NoUser>
						<Registration/>
					</NoUser>
				}/>
				<Route exact path="/prihlaseni" element={
					<NoUser>
						<Login/>
					</NoUser>
				}/>
				<Route exact path="/odhlaseni" element={
					<Logout/>
				}/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
