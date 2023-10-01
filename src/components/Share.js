import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Share = ({ shareObj, isOwner }) => {
    const [editing, setEditing] = useState(false);  // 수정 버튼을 클릭했을 때 립력란과 버튼이 나타나는 기준점
    const [newShare, setNewShare] = useState(shareObj.text);  // 입력란과 버튼이 나타날 때 입력란에 기존 트윗이 보이도록 초기값을 관리하는 상태변수

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(doc(dbService, "information", shareObj.id));
            if (shareObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, shareObj.attachmentUrl));
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewShare(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, "information", shareObj.id), { text: newShare });
        setEditing(false);
    };


    return (
        <div className='share'> 
            {editing ? (
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
                    {shareObj.attachmentUrl && (
                        <img src={shareObj.attachmentUrl} width='5px' height='5px' />
                    )}
                    <h4>{shareObj.text}</h4>
                    {isOwner && (
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
