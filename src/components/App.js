import { useEffect, useState } from "react";
import Router from 'components/Router';
import { authService } from 'fbase';
import 'firebase/compat/auth';
import { updateProfile } from "firebase/auth";

const App = () => {
  const [init, setInit] = useState(false); 
  const [userObj, setUserObj] = useState(null); // 로그인한 사람의 정보를 관리하기 위한 상태변수
  
  // useEffect(): 특정한 시점에 실행되는 함수, 파이어베이스 로그인 정보를 받게 되었을 때 즉, 파이어베이스가 초기화되는 시점을 잡아낸 다음 완료 이후 보여줄 화면 렌더링
  useEffect(() => {
    authService.onAuthStateChanged((user) =>{
    if (user) {
      setUserObj({
        uid: user.uid,
        displayName: user.displayName,
        updateProfile: (args) => updateProfile(user, {displayName: user.displayName }),
      });  // 로그인한 사람의 정보
    } else {
      setUserObj(false);
    }
      setInit(true);
    });
  }, []);  // []: 컴포넌트가 최초로 렌더링 완료되었을 때 1회만 동작

  // 함수가 실행되면 인증 모듈에서 authService.currentUser를 통해 얻은 새 user를 userObj에 업데이트
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
    });
  }

  return (
    <>
      {init ? (
        <Router
          refreshUser={refreshUser}
          isLoggedin={Boolean(userObj)}
          userObj={userObj}
        /> 
      ) : (
        "초기화중..."
      )}
    </>
  );
}

export default App;
