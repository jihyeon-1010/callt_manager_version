import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'routes/LoginPage/ResetPassword.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { authService } from 'fbase';

const ResetPassword = () => {
  // 이메일과 에러 상태를 관리하는 상태변수
  const [email, setEmail] = useState('');  
  const [error, setError] = useState('');

  // 이메일 입력값 변경 시 실행
  const handleEmailChange = (e) => {
    setEmail(e.target.value);  // 이메일 값 변경
    setError('');  // 에러 상태 초기화
  };

  // 비밀번호 재설정(비밀번호 찾기) 함수
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // 입력폼에 이메일이 비어있는지 확인 후 에러 처리
      if (!email.trim()) {
        setError('이메일을 작성해주세요.');
        return;
      }

      // 이메일을 이용하여 비밀번호 재설정 이메일 전송
      await sendPasswordResetEmail(authService, email);
      alert('비밀번호 재설정 이메일을 전송했습니다. 이메일을 확인해주세요.');
      setError(''); // 제출 성공 시 에러 상태 초기화
    } catch (error) {
      // 오류 발생 시 오류 메시지를 처리
      console.error('Error sending reset password email:', error);
      if (error.code === 'auth/user-not-found') {
        setError('해당 이메일로 등록된 사용자가 없습니다.');
      } else {
        setError('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className='passwordContainer'>
      <h3>비밀번호 재설정</h3>
      <form onSubmit={handleResetPassword}>
        <div className='mailAddress' style={{ lineHeight: '1.5' }}>
          계정의 이메일 주소를 입력해주세요. <br />
          비밀번호 재설정 링크가 포함된 메일이 발송됩니다.
        </div>
        <input
          name='email'
          type='email'
          placeholder='이메일'
          value={email}
          onChange={handleEmailChange}
        />
        {error && <p style={{ color: '#bf1650' }}><span>⚠&nbsp;</span>{error}</p>}
        <button type='submit' className='passSubmit'>메일 발송</button>
        <div>
          <Link
              style={{ color: '#38E07D', textDecoration: 'underline' }}
              to="/">로그인으로 돌아가기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
