import { useEffect, useState } from "react";
import Router from 'components/Router';
import { authService } from 'fbase';
import 'firebase/compat/auth';
import { updateProfile } from "firebase/auth";

const App = () => {
  const [init, setInit] = useState(false); // 초기화 상태를 관리하는 상태 변수
  const [userObj, setUserObj] = useState(null); // 로그인한 사람의 정보를 관리하기 위한 상태 변수
  
  // 파이어베이스가 초기화되는 시점을 잡아낸 다음 완료 이후 보여줄 화면 렌더링
  useEffect(() => {
    // 사용자의 인증 상태를 감지하고 처리
    authService.onAuthStateChanged((user) => {
    // 로그인한 사용자가 있는 경우, 로그인한 사용자의 정보를 설정
    if (user) {
      setUserObj({
        // 사용자의 UID
        uid: user.uid,  
        // 사용자의 표시 이름
        displayName: user.displayName,
        // 사용자 프로필 업데이트 함수
        updateProfile: (args) => updateProfile(user, {displayName: user.displayName }),
      });  
      console.log(user);
    } else {
      // 로그인한 사용자가 없는 경우, 사용자 정보를 초기화
      setUserObj(false);
    }
      // 초기화가 완료됨을 나타내는 상태를 true로 변경
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
