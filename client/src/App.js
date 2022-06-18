import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
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
		</Routes>
	)
}

export default App;
