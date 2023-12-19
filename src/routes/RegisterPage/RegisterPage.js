import { authService } from 'fbase';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, child } from 'firebase/database';
import md5 from "md5";
import 'routes/RegisterPage/RegisterPage.css';

const RegisterPage = () => {
    const { 
        register, 
        watch, 
        formState: { errors }, 
        handleSubmit 
    } = useForm();  
    // 회원가입 과정에서 발생한 에러 상태 저장
    const [errorFromSubmit, setErrorFromSubmit] = useState("");
    // 프로세스 처리 중 '가입하기' 버튼 중복클릭을 방지하기 위한 상태변수
    const [loading, setLoading] = useState(false);  
    // 비밀번호와 비밀번호 재입력을 처리하기 위한 현재 password값 가져오기
    const password = useRef();  
    password.current = watch("password");
    
    const onSubmit = async (data) => {
        try {
            // 로딩 상태를 true로 변경하여 중복 클릭 방지
            setLoading(true);  
            // 파이어베이스 인증을 이용한 회원가입
            let createdUser = await createUserWithEmailAndPassword(authService, data.email, data.password);

            console.log(createdUser);

            // 사용자 프로필 업데이트
            await updateProfile(authService.currentUser, {
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(
                    createdUser.user.email
                )}?d=identicon`,
            });

            // firebase 데이터베이스에 사용자 정보 저장
            const database = getDatabase();
            set(child(ref(database, `users`), createdUser.user.uid), {
                name: createdUser.user.displayName,
                Image: createdUser.user.photoURL
            });
            setLoading(false);  // 회원가입 완료 후 로딩 상태 false로 변경
        } catch (error) {
            setErrorFromSubmit(error.message)
            setLoading(false);  // 회원 가입 실패 시 로딩 상태 false로 변경
            // 5초 후 에러 메시지 초기화
            setTimeout(() => {
                setErrorFromSubmit("");
            }, 5000);
        }
    }

  return (
      <div className='auth-wrapper'>
        <h3>회원가입</h3>
        <form onSubmit={handleSubmit(onSubmit)} className='register_container'>
            <label>이메일</label>
            <input
                name='email'
                type='email'
                placeholder="example@callt.com"
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {/* 이메일 미입력 시 에러메시지 출력 */}
            {errors.email && errors.email.type === "required" && (
            <p>반드시 입력해야 하는 필수 사항입니다.</p>
            )}
            {/* 이메일 정규식 위반 시 에러메시지 출력 */}
            {errors.email && <p>올바르지 않은 이메일 형식입니다. 이메일을 다시 확인해주세요.</p>}
              
            <label>이름</label>
            <input name="name" placeholder="이름을 입력해주세요"
                {...register("name", { required: true, maxLength: 10 })}
            />
            {/* 이름 미입력 시 에러메시지 출력 */}
            {errors.name && errors.name.type === "required" && <p>반드시 입력해야 하는 필수 사항입니다.</p>}
            {/* 최대 10글자 초과 입력 시 에러메시지 출력 */}
            {errors.name && errors.name.type === "maxLength" && <p>이름은 최대 10자리 미만이어야 합니다.</p>}
            
            <label>비밀번호</label>
            <input
                className='pass'
                type='password'
                placeholder="숫자, 영문, 특수문자 조합 최소 6자"
                {...register("password", { required: true, minLength: 6, maxLength: 20 })}
            />
            {/* 비밀번호 미입력 시 에러메시지 출력 */}
            {errors.password && errors.password.type === "required" && (
            <p>반드시 입력해야 하는 필수 사항입니다.</p>
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
            <input
                name="password_confirm"
                type='password'
                placeholder="비밀번호 재입력"
                {...register("password_confirm", { required: true, validate: (value) => value === password.current })}
            />
            {/* 비밀번호확인 미입력 시 에러메시지 출력 */}
            {errors.password_confirm && errors.password_confirm.type === "required" && <p>반드시 입력해야 하는 필수 사항입니다.</p>}
            {/* 비밀번호와 비밀번호확인이 일치하지 않을 때 오류메시지 출력 */}
            {errors.password_confirm && errors.password_confirm.type === "validate" && <p>비밀번호가 일치하지 않습니다.</p>}

            {errorFromSubmit && <p>{errorFromSubmit}</p>}

            <input type="submit" disabled={loading} value={"가입하기"} />
            <div className='p1' style={{ color: '#9E9E9E' }}>
                이미 계정이 있으신가요?
                <Link style={{ color: '#38E07D', textDecoration: 'underline' }} to="/">
                    로그인
                </Link>
            </div>
        </form>
      </div>
  )
}

export default RegisterPage;
