import LoginPage from 'components/LoginPage/LoginPage';
import { authService } from 'fbase';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, child } from 'firebase/database';
import md5 from "md5";
import 'components/RegisterPage/RegisterPage.css';

function RegisterPage() {
    const { 
        register, 
        watch, 
        formState: { errors }, 
        handleSubmit 
    } = useForm({ mode: "onChange" });

    const [errorFromSubmit, setErrorFromSubmit] = useState("");
    const [loading, setLoading] = useState(false);
    const password = useRef();
    password.current = watch("password");

    const onSubmit = async (data) => {
        try {
        setLoading(true);
        let createdUser = await createUserWithEmailAndPassword(authService, data.email, data.password);

        console.log(createdUser);

        await updateProfile(authService.currentUser, {
            displayName: data.name,
            photoURL: `http://gravatar.com/avatar/${md5(
            createdUser.user.email
            )}?d=identicon`,
        });

        // firebase 데이터베이스에 저장해주기
        const database = getDatabase();
        set(child(ref(database, `users`), createdUser.user.uid), {
            name: createdUser.user.displayName,
            Image: createdUser.user.photoURL
        });
        setLoading(false);
        } catch (error) {
        // 에러메시지가 5초 후 사라지도록
        setErrorFromSubmit(error.message)
        setLoading(false);
        setTimeout(() => {
            setErrorFromSubmit("");
        }, 5000);
        }
    }

  return (
    <div className='auth-wrapper'>
        <div className='auth_content'>
            <div>
                <h3>회원가입</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label>이메일</label>
                <input className='email' type='email' placeholder="example@callt.com"
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                {/* 이메일 미입력 시 에러메시지 출력 */}
                {errors.email && errors.email.type === "required" && (
                <p>반드시 입력해야 하는 필수 사항입니다.</p>
                )}
                {/* 이메일 정규식 위반 시 에러메시지 출력 */}
                {errors.email && <p>올바르지 않은 이메일 형식입니다. 이메일을 다시 확인해주세요.</p>}   

                <label>이름</label>
                <input className='name' placeholder="이름을 입력해주세요"
                {...register("name", { required: true, maxLength: 10 })}
                />
                {/* 이름 미입력 시 에러메시지 출력 */}
                {errors.name && errors.name.type === "required" && (
                <p>반드시 입력해야 하는 필수 사항입니다.</p>
                )}
                {/* 최대 10글자 초과 입력 시 에러메시지 출력 */}
                {errors.name && errors.name.type === "maxLength" && (
                <p>이름은 최대 10자리 미만이어야 합니다.</p>
                )}

                <label>비밀번호</label>
                <input className='password' type='password' placeholder="숫자, 영문, 특수문자 조합 최소 6자"
                {...register("password", { required: true, minLength: 6, maxLength: 20 })}
                />
                {/* 비밀번호 미입력 시 에러메시지 출력 */}
                {errors.password && errors.password.type === "required" && (
                <p>비밀번호는 최소 6자리 이상이어야 합니다.</p>
                )}
                {/* 최소 6글자 미만 입력 시 에러메시지 출력 */}
                {errors.password && errors.password.type === "minLength" && (
                <p>비밀번호는 최소 8~20자 이내로 입력해야 합니다.</p>
                )}
                {/* 최대 20글자 이상 입력 시 에러메시지 출력 */}
                {errors.password && errors.password.type === "maxLength" && (
                <p>비밀번호는 최소 8~20자 이내로 입력해야 합니다.</p>
                )}

                <label>비밀번호 확인</label>
                <input className='password_confirm' type='password' placeholder="비밀번호 재입력"
                {...register("password_confirem", {
                    required: true,
                    validate: (value) => value === password.current
                })}
                />
                {/* 비밀번호확인 미입력 시 에러메시지 출력 */}
                {errors.password_confirm &&
                errors.password_confirm.type === "required" && (
                    <p>반드시 입력해야 하는 필수 사항입니다.</p>
                )}
                {/* 비밀번호와 비밀번호확인이 일치하지 않을 때 오류메시지 출력 */}
                {errors.password_confirm &&
                errors.password_confirm.type === "validate" && (
                    <p>비밀번호가 일치하지 않습니다.</p>
                )}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type='submit' disabled={loading} value={"가입하기"} />

                <div className='p1' style={{ color:'#9E9E9E' }}> 이미 계정이 있으세요? <Link style={{ color:'#38E07D'}} to="/login">로그인</Link></div>
            </form> 
        </div>
    </div>
  )
}

export default RegisterPage;

