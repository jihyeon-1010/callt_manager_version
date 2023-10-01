import React, { useEffect, useState } from 'react'
import { dbService } from 'fbase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Share from 'components/Share';
import CalltFactory from 'components/CalltFactory';

const Home = ({ userObj }) => {
  const [information, setInformation] = useState([]);  // 파이어스토어에서 받은 데이터를 관리하는 상태변수

  // 파이어스토어에서 문서 읽어오기(화면에 트윗 목록 출력)
  useEffect(() => {  // 컴포넌트가 모두 마운트된 이후에 문서 가져오기
    const q = query(collection(dbService, "information"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setInformation(newArray);
    });
  }, []);

  return (
    <div className='container'>
      <CalltFactory userObj={userObj} />
      <div style={{ marginTop: 20 }}>
        {information.map((share) => (  // map: 배열을 순회하는 함수, information 배열을 순회하면서 공유 목록 출력
          <Share
            key={share.id}
            shareObj={share}
            isOwner={share.creatorId === userObj.uid}  // 트윗의 uid와 현재 로그인한 사용자의 uid를 비교해서 같으면 [삭제], [업데이트] 버튼이 보이도록
          />
        ))}
      </div>
    </div>
  )
}

export default Home
