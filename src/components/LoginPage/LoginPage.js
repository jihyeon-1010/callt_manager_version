import React, { useState } from "react";
import logo from "assets/images/131.png";
import 'components/LoginPage/LoginPage.css';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authService } from 'fbase';

function LoginPage () {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
          setLoading(true);
    
          await signInWithEmailAndPassword(authService, data.email, data.password);
    
          setLoading(false);
        } catch (error) {
          setErrorFromSubmit(error.message);
    
          setLoading(false);
    
          setTimeout(() => {
            setErrorFromSubmit("");
          }, 5000);
        }
      };

    return (
        <section className="login_wrapper">
            <div className="login_content">
                {/* 로고 */}
                <div className="logo_img">
                    <img src={logo} className="mainLogo"/>
                </div>
                <h3>로그인</h3>
                
                {/* 폼 */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* 이메일 또는 휴대전화 */}
                    <input className="email" type="email"  placeholder="이메일" 
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    />

                    {errors.email && <p>This email field is required</p>}

                    {/* 비밀번호 */}
                    <input className="password" type="password" placeholder="비밀번호" 
                    {...register("password", { required: true, minLength: 6 })}
                    />

                    {errors.password && errors.password.type === "required" && (
                            <p>This password field is required</p>
                            )}

                    {errors.password && errors.password.type === "minLength" && (
                    <p>Password must have at least 6 characters</p>
                    )}

                    {/* 아이디 저장하기 */}
                    <div className="id_check">
                        <input type="checkbox" className="check" />
                        <label htmlFor="check_id"><span className="check_id_checkBox">Remember ID</span></label>
                    </div>
                    
                    {errorFromSubmit && <p>{errorFromSubmit}</p>}
                    {/* 로그인 버튼 */}
                    <input type="submit" disabled={loading} value={"로그인"}/>
                </form>

                <div className="direction_wrapper">
                    {/* 비밀번호 찾기 */}
                    <div className="pass_forgot"><Link style={{ color: "#38E07D" }} to={"/forgot_pw"}>비밀번호 찾기</Link></div>
                    {/* 회원가입 */}
                    <div className="signUp" style={{ color:'#9E9E9E' }}>아직 계정이 없으신가요? <Link style={{ color:'#38E07D'}} to="/register">회원가입</Link></div>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;