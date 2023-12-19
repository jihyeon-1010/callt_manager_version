import React, { useEffect, useState } from 'react'
import { dbService } from 'fbase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Share from 'components/Share';
import CalltFactory from 'components/CalltFactory';

const Home = ({ userObj }) => {
  // 파이어스토어에서 받은 데이터를 관리하는 상태변수
  const [information, setInformation] = useState([]);  

  // 파이어스토어에서 문서 읽어오기(화면에 쓰레기통 상태 목록 출력)
  useEffect(() => {  
    // 컴포넌트가 모두 마운트된 이후에 문서 가져오기
    // 'information' 컬렉션의 문서를 'createAt' 필드를 기준으로 내림차순으로 정렬하여 쿼리 생성
    const q = query(collection(dbService, "information"), orderBy("createdAt", "desc"));
    // q 쿼리의 결과를 실시간으로 구독하여 변화를 감지하고 새로운 정보를 가져옴
    onSnapshot(q, (snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        // 가져온 문서들을 매핑하여 새로운 배열로 변환
        id: document.id,  // 문서의 고유 id
        ...document.data(),  // 문서의 데이터 
      }));
      setInformation(newArray);  // 새로운 배열로 상태 업데이트
    });
  }, []);  

  return (
    <div className='container'>
      <CalltFactory userObj={userObj} />
      <div style={{ marginTop: 20 }}>
        {/* map: 배열을 순회하는 함수, information 배열을 순회하면서 공유 목록 출력 */}
        {information.map((share) => (  
          <Share
            // 고유한 키로 사용되는 문서의 id
            key={share.id}  
            // 각각의 공유 정보를 Share 컴포넌트에 전달
            shareObj={share}  
            // 트윗의 uid와 현재 로그인한 사용자의 uid를 비교해서 같으면 [삭제], [업데이트] 버튼이 보이도록
            isOwner={share.creatorId === userObj.uid}  
          />
        ))}
      </div>
    </div>
  )
}

export default Home
