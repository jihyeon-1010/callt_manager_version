import LoginPage from 'routes/LoginPage/LoginPage';
import RegisterPage from 'routes/RegisterPage/RegisterPage';
import Profile from 'routes/ManagerPage/Profile';
import Home from 'routes/ManagerPage/Home';
import ResetPassword from 'routes/LoginPage/ResetPassword';
import ManagerPage from 'routes/ManagerPage/ManagerPage';
import LoadCheck from 'routes/ManagerPage/LoadCheck';
import Navigation from 'components/Navigation';
import { authService } from 'fbase';
import 'firebase/compat/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { faDirections } from '@fortawesome/free-solid-svg-icons';

const Router = ({ isLoggedin, userObj, refreshUser }) => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            {isLoggedin && <Navigation userObj={userObj} />}
            <>
                <Routes>
                    {/* 로그인 상태에 따라 다른 페이지 렌더링 */}
                    {isLoggedin ? (
                        <>
                            {/* 로그인한 경우의 경로 */}
                            <Route exact path='/' element={<div style={{
                                maxWidth: 890,
                                width: "100%",
                                margin: "0 auto",
                                display: "flex",
                                justifyContent: "center", }}><Home userObj={userObj} /></div>} />
                            <Route exact path='/manager' element={<ManagerPage />} />
                            <Route exact path='/profile' element={<div style={{
                                maxWidth: 890,
                                width: "100%",
                                margin: "0 auto",
                                display: "flex",
                                justifyContent: "center", }}><Profile refreshUser={refreshUser} userObj={userObj} /></div>} />
                            <Route exact path='/loadcheck' element={<div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center", }}><LoadCheck /></div>} />
                        </>
                    ) : (
                        <>
                            {/* 로그인하지 않은 경우의 경로 */}
                            <Route exact path='/' element={<LoginPage />} />
                            <Route exact path='/resetPassword' element={<div style={{
                                maxWidth: 890,
                                width: "100%",
                                margin: "0 auto",
                                display: "flex",
                                justifyContent: "center", }}><ResetPassword /></div>} />
                            <Route exact path='/register' element={<div style={{
                                maxWidth: 890,
                                width: "100%",
                                margin: "0 auto",
                                display: "flex",
                                justifyContent: "center", }}><RegisterPage /></div>} />
                        </>
                    )}
                </Routes>
            </>
        </BrowserRouter>
    );
}

export default Router;