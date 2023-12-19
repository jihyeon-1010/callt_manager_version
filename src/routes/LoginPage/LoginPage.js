import React, { useState } from "react";
import logo from "assets/images/14.png";
import google from "assets/images/google.png"
import github from "assets/images/github.png";
import 'routes/LoginPage/LoginPage.css';
import { Link } from 'react-router-dom';
import { authService } from "fbase";
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const LoginPage = () => {
    const [email, setEmail] = useState("");  // 이메일 상태값 선언 및 초기화
    const [password, setPassword] = useState("");  // 비밀번호 상태값 선언 및 초기화
    const [error, setError] = useState("");  // 에러 메시지 상태값 선언 및 초기화

    // input 엘리먼트에서 입력된 값으로 상태 업데이트
    const onChange = (event) => {  
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);  // 이메일 값 업데이트
        } else if (name === "password") {
            setPassword(value);  // 비밀번호 값 업데이트
        }
    }

    // 로그인
    const onSignSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            // 인자로 전달받은 이메일, 비밀번호를 파이어베이스 DB에 전달하여 확인 후 로그인하는 함수
            data = await signInWithEmailAndPassword(authService, email, password);  
        } catch (error) {
            setError(error.message)  // 로그인 오류 발생 시 에러 메시지 업데이트
        }
    }

    // 소셜 로그인
    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            // 구글 소셜 로그인 프로바이더 생성
            provider = new GoogleAuthProvider();  
        } else if (name === "github") {
            // 깃허브 소셜 고르인 프로바이더 생성
            provider = new GithubAuthProvider();  
        }
        // 해당 소셜 로그인 프로바이더로 로그인
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
                    <input
                        className="email"
                        name="email" type="email"
                        placeholder="이메일"
                        autoFocus
                        required
                        value={email}
                        onChange={onChange}
                    />
                    <input
                        className="password"
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        required
                        value={password}
                        onChange={onChange}
                    />
                    <input
                        type="submit"
                        value={"로그인"}
                        className="authInput authSumit"
                    />
                    {error && <span className='authError'>{error}</span>}
                    <div className="resetPassword">
                        <Link style={{ color: '#38E07D', textDecoration: 'underline' }}
                            to="/resetPassword">
                            비밀번호 재설정
                        </Link>
                    </div>
                    <div className="signUp" style={{ color: '#9E9E9E' }}>
                        아직 계정이 없으신가요?
                        <Link style={{ color: '#38E07D', textDecoration: 'underline' }}
                            to="/register">
                            회원가입
                        </Link>
                    </div>          
                </form>
                {/* <div className="hr-sect">간편 로그인</div> */}
                <hr />
                <div className="social">
                    <img
                        src={github}
                        onClick={onSocialClick}
                        name="github"
                        width="35px"
                        height="35px"
                        className="loginimg1"
                    />
                    <img
                        src={google}
                        onClick={onSocialClick}
                        name="google"
                        width="35px"
                        height="35px"
                        className="loginimg2"
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;