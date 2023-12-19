import React from 'react'
import { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"; 


const CalltFactory = ({ userObj }) => {
    const [share, setShare] = useState("");  // 입력된 쓰레기통 상태를 관리하기 위한 상태 변수 
    const [attachment, setAttachment] = useState("");  // 컴퓨터에서 파일 위치(url)를 관리하는 상태 변수

    // 파이어스토어에 데이터 저장
    const onSubmit = async (event) => {
        event.preventDefault();
        if (share === "") {
            return;
        }
        let attachmentUrl = "";
        if (attachment !== "") {  // attachment 값이 있을 때만 스토리지에 파일을 등록할 수 있음.
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        
        const shareObj = {
            text: share,  // 쓰레기통 상태 내용
            createdAt: Date.now(),  // 생성 시간
            creatorId: userObj.uid,  // 생성자 ID
            attachmentUrl,  // 첨부 파일 url
        }

        await addDoc(collection(dbService, "information"), shareObj);  // 파이어스토어에 정보 추가
        setShare("");  // 입력창 초기화
        setAttachment("");  // 첨부 파일 초기화
    }

    // 입력값 변화 처리
    const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setShare(value);  // 입력된 쓰레기통 상태 업데이트
    }

    // 파일 첨부 양식 만들기
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);  // 첨부파일 url 업데이트
        };
        if (Boolean(theFile)) {
            reader.readAsDataURL(theFile);  // 파일 url 읽어오기
        }
    };

    // 첨부파일 제거
    const onClearAttachment = () => setAttachment("");  // 첨부파일 초기화

    return (
        <form onSubmit={onSubmit} className='factoryForm'>
            <div className='factoryInput__container'>
                <input
                    className='factoryInput__input'
                    value={share}
                    onChange={onChange}
                    type='text'
                    placeholder='쓰레기통 상태를 공유해주세요.'
                    maxLength={120}
                    autoFocus
                />    
                <input type='submit' value='&rarr;' className='factoryInput__arrow' />
            </div>
            <label htmlFor='attach-file' className='factoryInput__label'>
                <span>사진 추가</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type='file'
                accept='image/*'
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className='factoryForm__attachment'>
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className='factoryForm__clear' onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default CalltFactory;
