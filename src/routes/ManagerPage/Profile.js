import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);  // 관리자 프로필 name 관리 상태변수

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    }

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
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
