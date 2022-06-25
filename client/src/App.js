import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CreateMaterial from './pages/CreateMaterial/CreateMaterial';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import PasswordReset from './pages/PasswordReset/PasswordReset';
import Registration from './pages/Registration/Registration';
import NoUser from './route-guards/NoUser';
import RequireAuth from './route-guards/RequireAuth';

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
				<Route exact path="/zapomenute-heslo" element={
					<ForgotPassword/>
				}/>
				<Route exact path="/reset-hesla/:token" element={
					<PasswordReset/>
				}/>
				<Route exact path="/vytvoreni-materialu" element={
					<RequireAuth>
						<CreateMaterial/>
					</RequireAuth>
				}/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
