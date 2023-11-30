import React from 'react'
import 'routes/ManagerPage/LoadCheck';
import { Link } from "react-router-dom";
import 'routes/ManagerPage/LoadCheck.css';

const LoadCheck = () => {
  return (
    <>
    <div className='trash'>
        <div>
            <Link to="/manager">
                <button className='generalTrash'>
                    일반 쓰레기
                </button>          
            </Link>
        </div>
        <div>
            <button className='recyclableWaste'>
                재활용 쓰레기
            </button>
        </div>
    </div>
    </>
  )
}

export default LoadCheck
