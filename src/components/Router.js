import LoginPage from 'routes/LoginPage/LoginPage';
import RegisterPage from 'routes/RegisterPage/RegisterPage';
import Profile from 'routes/ManagerPage/Profile';
import Home from 'routes/ManagerPage/Home';
import ManagerPage from 'routes/ManagerPage/ManagerPage';
import Navigation from 'components/Navigation';
import { authService } from 'fbase';
import 'firebase/compat/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Router = ({ isLoggedin, userObj, refreshUser }) => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            {isLoggedin && <Navigation userObj={userObj} />}
            <>
                <Routes>
                    {isLoggedin ? (
                        <>
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
                        </>
                        
                    ) : (
                        <>
                            <Route exact path='/' element={<LoginPage />} />
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