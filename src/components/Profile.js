import { authService } from 'fbase';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Profile() {
    const navigate = useNavigate();

    const onLogOutClic = () => {
        authService.signOut();
        navigate("/");
    }

    return (
        <div>
            <button onClick={onLogOutClic}>로그아웃</button>
        </div>
    )
}

export default Profile;
