import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  const navigate = useNavigate();
  const googleLogout = () => {
    googleLogout();
  };
  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const userDetails = jwtDecode(credentialResponse.credential);
          console.log(credentialResponse);

          console.log(userDetails);

          toast.success(` Welcome!! ${userDetails?.name}`);
          // navigate("/chat");
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
      <button onClick={googleLogout}></button>
    </>
  );
};

export default SignIn;
