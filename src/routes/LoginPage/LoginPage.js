import React, { useState } from "react";
import logo from "assets/images/14.png";
import google from "assets/images/google.png"
import github from "assets/images/github.png";
import 'routes/LoginPage/LoginPage.css';
import { Link } from 'react-router-dom';
import { authService } from "fbase";
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // input 엘리먼트에서 입력된 값으로 상태 업데이트
    const onChange = (event) => {  
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);  
        } else if (name === "password") {
            setPassword(value);
        }
    }

    // 로그인
    const onSignSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            data = await signInWithEmailAndPassword(authService, email, password);  // 인자로 전달받은 이메일, 비밀번호를 파이어베이스 DB에 전달하여 확인 후 로그인하는 함수
        } catch (error) {
            setError(error.message)
        }
    }

    // 소셜 로그인
    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider();
        } else if (name === "github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
    } 

    return (
        <div className="authContainer">
            {/* 로고 */}
            <div className="logo_img">
                <img src={logo} className="mainLogo"/>
            </div>
            <h3>로그인</h3>
            <div className="log">
                <form onSubmit={onSignSubmit} className="loginContainer">
                    <input className="email" name="email" type="email" placeholder="이메일" autoFocus required value={email} onChange={onChange}/>
                    <input className="password" name="password" type="password" placeholder="비밀번호" required value={password} onChange={onChange}/>
                    <input type="submit" value={"로그인"} className="authInput authSumit" />
                    {error && <span className='authError'>{error}</span>}
                    <div className="signUp" style={{ color: '#9E9E9E' }}>아직 계정이 없으신가요? <Link style={{ color: '#38E07D' }} to="/register">회원가입</Link></div>          
                </form>
                {/* <div className="hr-sect">간편 로그인</div> */}
                <hr />
                <div className="social">
                    <img src={github} onClick={onSocialClick} name="github" width="35px" height="35px" className="loginimg1"/>
                    <img src={google} onClick={onSocialClick} name="google" width="35px" height="35px" className="loginimg2"/>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;