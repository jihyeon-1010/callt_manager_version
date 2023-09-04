import { useEffect, useState } from "react";
import Router from 'components/Router';
import { authService } from 'fbase';
import 'firebase/compat/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedin(user);
      } else {
        setIsLoggedin(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <Router isLoggedin={isLoggedin} /> : "initializing..."}
    </>
  );
}

export default App;
