import logo from './logo.svg';
import LoginPage from 'components/LoginPage/LoginPage';
import RegisterPage from 'components/RegisterPage/RegisterPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authService } from 'fbase';
import 'firebase/compat/auth';

console.log(authService);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
