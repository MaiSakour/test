import React from "react";
import {useEffect,useState,useRef} from "react";
import {faCheck,faTimes,faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import axios from "./api/axios";
const USER_REGEX=/^[a-zA-Z][a=zA-Z0-9-_]{3.23}$/
const PWD_REGEX=/^(?=.*[A=Z])(?=.*[0-9])(?=.*[!@#$%]).{8.24}$/
const REGISTER_URL='/registe'
const Register=()=>{
    const userRef=useRef()
    const errRef=useRef()

    const [user,setUser]=useState('')
    const[validName,setValidName]=useState(false)
    const[userFocus,setUserFocus]=useState(false)

    const [Pwd,setPwd]=useState('')
    const[validPwd,setValidPwd]=useState(false)
    const[PwdFocus,setPwdFocus]=useState(false)

    const [matchPwd,setMatchPwd]=useState('')
    const[validMatch,setValidMatch]=useState(false)
    const[matchFocus,setMatchFocus]=useState(false)

    const [errMsg,setErrMsg]=useState('')
    const [success,setSuccess]=useState(false)

    useEffect(()=>{userRef.current.focus()},[])

    useEffect(()=>{const result=USER_REGEX.test(user)
    console.log(result);console.log(user);setValidName(result)},[user])

    useEffect(()=>{const result=PWD_REGEX.test(Pwd)
        console.log(result);console.log(Pwd);setValidPwd(result)
        const match =Pwd === matchPwd;
        setValidMatch(match)
    },[Pwd,matchPwd])
    useEffect(()=>{setErrMsg('')},[user,Pwd,matchPwd])

    const handleSubmit= async(e)=>{e.prevertDefault()
    const v1 = USER_REGEX.test(user)
    const v2= PWD_REGEX.test(Pwd)
    if (!v1 || !v2){setErrMsg('Invalid Entry')
    return;}
    try{
        const response =await axios.post(REGISTER_URL,JSON.stringify({user,Pwd}),{
            headers:{'content-Type':'application/json'},
            withCredentials:true
        }
        )
        console.log(response?.data)
        console.log(response?.accessToken)
        console.log(JSON.stringify(response))
        setSuccess(true)
        setUser('')
setPwd('')
setMatchPwd('')
    }catch(err){
        if(!err?.response){setErrMsg('no server response')}
        else if (err.response?.status===409){
            setErrMsg('username Taken')
        }else{setErrMsg('registration failed')}
        errRef.current.focus()
    }}

    return(
    <>{success?(<section><h1>success!</h1>
    <p><a href="#">Sing In</a></p></section>):(
    <section>
        <div ref={errRef} className={errMsg?"errmsg":"offscreen"} aria-live="assertive">{errMsg}</div>
        <h1>Regester</h1>
        <form  onSubmit={handleSubmit}>
            <label htmlFor="username">
                username:
                <span className={validName ? "valid" : 'hide'}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validName || !user ? "hide":"invalid" }>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            </label>
            <input
            type='text'
            id='username'
            ref={userRef}
            autoComplete="off"
            onChange={(e)=>setUser(e.target.value)}
            required
            aria-invalid={validName ? 'false' : 'true'}
            aria-describedby='uidnote'
            onFocus={()=>setUserFocus(true)}
            onBlur={()=>setUserFocus(false)}/>
            <p id='uidnote' claassName={userFocus && user && !validName ? "instructions":"offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>4 to 24 characters.<br/>
                must being with a letter.<br/>
                letters,numbers,underscores,hyphens allowed.</p>
                {/* //////////////////////////// */}
                <label htmlFor="password">
                password:
                    <span className={validPwd  ? "valid" : 'hide'}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={validPwd || !Pwd? "hide":"invalid" }>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>
            <input
            type='password'
            id='password'
            // ref={useRef}
            // autoComplete="off"
            onChange={(e)=>setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? 'false' : 'true'}
            aria-describedby='pwdnote'
            onFocus={()=>setPwdFocus(true)}
            onBlur={()=>setPwdFocus(false)}/>
            <p id='uidnote' claassName={PwdFocus &&  !validPwd ? "instructions":"offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>8 to 24 characters.<br/>
                must being with a letter.<br/>
                letters,numbers,underscores,hyphens allowed.
                allowed special Characters:<span aria-label="exclamation mark">!</span>
                <span aria-label="at symbol">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="qollar sign">$</span>
                <span aria-label="percent">%</span></p>
                {/* /////////////////////////////// */}
                <label htmlFor="confirm_pwd">
                Confirm password:
                    <span className={validMatch && matchPwd  ? "valid"  : 'hide'}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={validMatch || !matchPwd? "hide":"invalid" }>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>
            <input
            type='password'
            id='confirm_pwd'
            onChange={(e)=>setMatchPwd(e.target.value)}
            required
            aria-invalid={validMatch ? 'false' : 'true'}
            aria-describedby='confirmnote'
            onFocus={()=>setMatchFocus(true)}
            onBlur={()=>setMatchFocus(false)}/>
            <p id='confirmnote' claassName={matchFocus &&  !validMatch ? "instructions":"offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>must match the first password input field.</p>
            <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sing Up</button>
            
        </form>
        <p>Already registered?<br/>
        <span className="line">{/*put router link here*/}
        <a href="#">Sign In</a></span></p></section>)}</>)}
export default Register;
