// react libraries
import React, { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

//  Other utility libraries
import axios from "axios";

//  external CSS
import "./SignUp.styles.css";
import { UserContext } from "../../Context/userContext";
const SignUp = () => {
  const { setUserName, setPwd } = useContext(UserContext);
  // Refs to store form current values
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  // Hook states
  const [errorMsg, seterrorMsg] = useState("");

  // instance of history to push to other routes
  let history = useHistory();

  
  const handleEnrollement = () => {
    const user = {
      name: userNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    // Sending data to backend to check user exists else enroll the user
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/signUp`, user)
      .then((data) => {
        if (data.data.status === 201){ 
          localStorage.setItem("userName", userNameRef.current.value); 
          localStorage.setItem("password", passwordRef.current.value);
           setUserName(userNameRef.current.value);
           setPwd(passwordRef.current.value);
          history.push("/dashboard")
        }
        else if(data.data.status === 400) seterrorMsg(data.data.msg);
      })
      .catch((err) => {
        console.log("err");
      });
  };
  // handle form submission
  const handleClick = (e) => {
    e.preventDefault();
    if (
      passwordRef.current.value === "" ||
      emailRef.current.value === "" ||
      emailRef.current.value === "" ||
      userNameRef.current.value === ""
    )
      seterrorMsg("Enter details");
    else if (passwordConfirmRef.current.value !== passwordRef.current.value)
      seterrorMsg("Password didn't match");
    else {
      
      handleEnrollement();
    }
  };

  return (
    <div className="signup-form form">
      {errorMsg === "" ? null : <span className="error-span">{errorMsg}</span>}
      <input type="text" required placeholder="Username" ref={userNameRef} />
      <br />
      <input ref={emailRef} type="email" required placeholder="Email" />
      <br />
      <input
        ref={passwordRef}
        type="password"
        required
        placeholder="Password"
      />
      <br />
      <input
        ref={passwordConfirmRef}
        type="password"
        required
        placeholder="Confirm Password"
      />
      <br />
      <button onClick={handleClick}>Sign Up</button>
    </div>
  );
};

export default SignUp;
