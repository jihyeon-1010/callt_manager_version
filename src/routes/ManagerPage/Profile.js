import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

const Profile = ({ userObj, refreshUser }) => {
    // 네비게이션을 위한 함수를 가져옴
    const navigate = useNavigate(); 
    // 관리자 프로필 name 관리 상태변수
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);  

    // 로그아웃 버튼 클릭 시 실행
    const onLogOutClick = () => {
        authService.signOut();  // 로그아웃
        navigate("/");  // 로그인 페이지로 이동
    }

    // 입력값이 변경될 때 실행
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);  // 입력된 값을 새로운 이름으로 설정
    }

    // 프로필 업데이트
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            // 현재 사용자의 displayName을 새로운 이름으로 업데이트
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();  // 사용자 정보 새로고침
        }
    };

    return (
        <div className='container'>
            <form onSubmit={onSubmit} className='profileForm'>
                <input
                    onChange={onChange}
                    type='text'
                    placeholder='이름 표시하기'
                    value={newDisplayName}
                    autoFocus
                    className='formInput'
                />
                <input
                    type='submit'
                    value='프로필 업데이트'
                    className='formBtn'
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>
                로그아웃
            </span>
        </div>
    );
};

export default Profile;
