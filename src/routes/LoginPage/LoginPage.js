import React, { useState } from "react";
import logo from "assets/images/131.png";
import 'routes/LoginPage/LoginPage.css';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { authService, firebaseInstance } from 'fbase'; 

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


    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [newAccount, setNewAccount] = useState(true);
    // const [error, setError] = useState("");

    // className 속성을 활용해 소셜 로그인을 분기
    const onSocialClick = async (event) => {
        const {
            target: { className }
        } = event;
        let provider;
        if (className === "google") {
            provider = new GoogleAuthProvider();
        } else if (className === "github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    };

    // const onChange = (event) => {
    //     const {
    //         target : { className, value },
    //     } = event;
    //     if (className === "email") {
    //         setEmail(value);
    //     } else if (className === "password") {
    //         setPassword(value);
    //     }
    // }
    
    // const onSubmit = async (event) => {
    //     event.preventDefault();
    //     try {
    //         let data;
    //         if (newAccount) {
    //             // 회원가입
    //             data = await createUserWithEmailAndPassword(authService, email, password);
    //         } else {
    //             // 로그인
    //             data = await signInWithEmailAndPassword(authService, email, password);
    //         }
    //         console.log(data);
    //     } catch (error) {
    //         setError(error.message)
    //     }
    // };
    
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
                    {...register("email", { pattern: /^\S+@\S+$/i })}
                    />

                    {errors.email && <p>올바르지 않은 이메일 형식입니다. 이메일을 다시 확인해주세요.</p>}  

                    {/* 비밀번호 */}
                    <input className="password" type="password" placeholder="비밀번호" 
                    {...register("password", { minLength: 6, maxLength: 20  })}
                    />

                    {errors.password && errors.password.type === "minLength" && (
                    <p>비밀번호는 최소 8~20자 이내로 입력해야 합니다.</p>
                    )}
                    {errors.password && errors.password.type === "maxLength" && (
                    <p>비밀번호는 최소 8~20자 이내로 입력해야 합니다.</p>
                    )}

                    {errorFromSubmit && <p>{errorFromSubmit}</p>}
                    
                    {/* 로그인 버튼 */}
                    <input type="submit" disabled={loading} value={"로그인"}/>
                
                    {/* 아이디 저장하기 */}
                    <div className="id_check">
                        <input type="checkbox" className="check" />
                        <label htmlFor="check_id"><span className="check_id_checkBox">Remember ID</span></label>
                        {/* 아이디 찾기 */}
                        <Link style={{ color: "#38E07D" }} to="/findpw">아이디 찾기</Link>
                        {/* 비밀번호 찾기 */}
                        <Link style={{ color: "#38E07D" }} to="/findpw">비밀번호 찾기</Link>
                    </div>

                    {/* 소셜 로그인 */}
                    <div>        
                        <span><button className="google" onClick={onSocialClick}>구글</button></span>
                        <span><button className="github" onClick={onSocialClick}>깃허브</button></span>
                    </div>
                
                    {/* 회원가입 */}
                    <div className="signUp" style={{ color:'#9E9E9E' }}>아직 계정이 없으신가요? <Link style={{ color:'#38E07D'}} to="/register">회원가입</Link></div>          
                </form>
            </div>
        </section>


        // <section className="login_wrapper">
        //     <div className="login_content">
        //         {/* 로고 */}
        //         <div className="logo_img">
        //             <img src={logo} className="mainLogo"/>
        //         </div>
        //         <h3>로그인</h3>

        //         {/* 폼 */}
        //         <form onSubmit={onSubmit}>
        //             {/* 이메일 또는 휴대전화 */}
        //             <input className="email" type="email"  placeholder="이메일" value={email} onChange={onChange}/>
        //             {/* 비밀번호 */}
        //             <input className="password" type="password" placeholder="비밀번호" value={password} onChange={onChange}/>
        //             {/* 로그인 버튼 */}
        //             <input type="submit" value={newAccount ? "회원가입" : "로그인"}/>
        //             {error}
        //             {/* 소셜 로그인 */}
        //             <div>        
        //                 <span><button className="google" onClick={onSocialClick}>구글</button></span>
        //                 <span><button className="github" onClick={onSocialClick}>깃허브</button></span>
        //             </div>
        //         </form>
        //     </div>
        // </section>
    );
}

export default LoginPage;