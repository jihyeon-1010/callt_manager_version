import React from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouse, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link
            to="/"
            style={{
              width: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faHouse} color={"#1ada6a"} size='2x' />
            <span style={{ marginTop: 10 }}>
              홈
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/manager"
            style={{
              width: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faBarsProgress} color={"#1ada6a"} size='2x'/>
            <span style={{ marginTop: 10 }}>
              적재량 확인
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            style={{
              width: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#1ada6a"} size='2x' />
            <span style={{ marginTop: 10 }}>
              {userObj.displayName
                ? `${userObj.displayName}의 프로필`
                : "프로필"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
