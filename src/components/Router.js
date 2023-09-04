import LoginPage from 'routes/LoginPage/LoginPage';
import RegisterPage from 'routes/RegisterPage/RegisterPage';
import FindLoginPw from 'routes/FindLoginPage/FindLoginPw';
import Profile from 'components/Profile';
import ManagerPage from 'routes/ManagerPage/ManagerPage';
import Navigation from 'components/Navigation';
import { authService } from 'fbase';
import 'firebase/compat/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Router = ({ isLoggedin }) => {
    return (
        <BrowserRouter>
            {isLoggedin && <Navigation />}
            <Routes>
                {isLoggedin ? (
                    <>
                        <Route exact path="/" element={<ManagerPage />} />
                        <Route exact path='/profile' element={<Profile />} />
                    </>
                ) : (
                        <Route exact path="/" element={<LoginPage />} />
                )} 
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/register" element={<RegisterPage />} />
                <Route exact path="/findpw" element={<FindLoginPw />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;