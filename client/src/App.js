import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CreateMaterial from './pages/CreateMaterial/CreateMaterial';
import DeleteMaterial from './pages/DeleteMaterial/DeleteMaterial';
import EditMaterial from './pages/EditMaterial/EditMaterial';
import EditWrongAnswers from './pages/EditWrongAnswers/EditWrongAnswers';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import LikedMaterials from './pages/LikedMaterials/LikedMaterials';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import Material from './pages/Material/Material';
import Materials from './pages/Materials/Materials';
import MyMaterials from './pages/MyMaterials/MyMaterials';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import PasswordReset from './pages/PasswordReset/PasswordReset';
import Registration from './pages/Registration/Registration';
import Test from './pages/Test/Test';
import NoUser from './route-guards/NoUser';
import RequireAuth from './route-guards/RequireAuth';

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="*" element={
					<NotFoundPage/>
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
				<Route exact path="/editace-materialu/:materialId" element={
					<RequireAuth>
						<EditMaterial/>
					</RequireAuth>
				}/>
				<Route exact path="/editace-spatnych-odpovedi/:materialId" element={
					<RequireAuth>
						<EditWrongAnswers/>
					</RequireAuth>
				}/>
				<Route exact path="/smazani-materialu/:materialId" element={
					<RequireAuth>
						<DeleteMaterial/>
					</RequireAuth>
				}/>
				<Route exact path="/materialy" element={
					<Materials/>
				}/>
				<Route exact path="/moje-materialy" element={
					<RequireAuth>
						<MyMaterials/>
					</RequireAuth>
				}/>
				<Route exact path="/oblibene-materialy" element={
					<RequireAuth>
						<LikedMaterials/>
					</RequireAuth>
				}/>
				<Route exact path="/material/:materialId" element={
					<Material/>
				}/>
				<Route exact path="/test/:materialId" element={
					<Test/>
				}/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
