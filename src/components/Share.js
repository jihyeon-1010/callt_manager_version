import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Share = ({ shareObj, isOwner }) => {
    // 수정 버튼을 클릭했을 때 입력란과 버튼이 나타나는 기준점
    const [editing, setEditing] = useState(false);  
    // 입력란과 버튼이 나타날 때 입력란에 기존 내용이 보이도록 초기값을 관리하는 상태변수
    const [newShare, setNewShare] = useState(shareObj.text);  

    // 쓰레기통 정보 삭제
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if (ok) {
            // 파이어스토어에서 해당 쓰레기통 정보 삭제
            await deleteDoc(doc(dbService, "information", shareObj.id));
            if (shareObj.attachmentUrl !== "") {
                // 스토리지에서 첨부 파일 삭제
                await deleteObject(ref(storageService, shareObj.attachmentUrl));
            }
        }
    };

    // 수정 모드로 전환
    const toggleEditing = () => setEditing((prev) => !prev);

    // 입력값 변경 시 처리
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewShare(value);  // 수정된 쓰레기통 상태 업데이트
    };

    // 수정된 쓰레기통 상태를 저장
    const onSubmit = async (event) => {
        event.preventDefault();
        // 파이어스토어에 수정된 상태 업데이트
        await updateDoc(doc(dbService, "information", shareObj.id), { text: newShare });
        setEditing(false);  // 수정 모드 종료
    };


    return (
        <div className='share'> 
            {editing ? (  // 수정 모드일 경우
                <>
                    <form onSubmit={onSubmit} className='container shareEdit'>
                        <input
                            onChange={onChange}
                            value={newShare}
                            required
                            placeholder='Edit your share'
                            autoFocus
                            className='formInput'
                        />
                        <input type='submit' value={"업데이트"} className='formBtn'/>
                    </form>
                    <button onClick={toggleEditing} className='formBtn cancelBtn' >
                        취소
                    </button>
                </>
            ) : (
                <>
                    {/* 수정 모드가 아닐 경우 */}
                    {shareObj.attachmentUrl && (  // 첨부 파일이 있는 경우
                        <img src={shareObj.attachmentUrl} width='5px' height='5px' />
                    )}
                    <h4>{shareObj.text}</h4>
                    {isOwner && (  // 작성자인 경우
                        <div className='share__actions'>
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
                )}
        </div>
    )
}

export default Share;
