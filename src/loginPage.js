import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import axios from "axios"

const LoginPage = ()=>{
    const [userData,setUserData] = useState({})
    const navigate = useNavigate();

    useEffect(()=>{
    if(userData!=null){
        localStorage.setItem('userData',JSON.stringify(userData))
        navigate('/task')
        window.location.reload()
    }
    },[userData])

    const handleLogin = (credentialResponse)=>{
        const result = jwtDecode(credentialResponse.credential)
        axios.post(`http://localhost:8000/api/auth/signIn`,{name:result.given_name,email:result.email,image:result.picture})
        .then((res)=>{
            setUserData(res.data.data[0])
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    return(
        <>
        <GoogleOAuthProvider clientId="342552550623-7f98r5rau4rqqhumrndcjptfihh4i1f6.apps.googleusercontent.com">
            <GoogleLogin
            onSuccess={credentialResponse => handleLogin(credentialResponse) }
            onError={() => {
                console.log('Login Failed');
            }}
            
            />
        </GoogleOAuthProvider>
        </>
    )
}

export default LoginPage;
