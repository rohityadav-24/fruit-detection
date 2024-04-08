import React, { useState, useEffect } from 'react'
import Head from 'next/head';

import Login from '../../Components/Login'
import Signup from '../../Components/Signup'
import Link from 'next/link';

const Index = ({ name, tst, router }) => {
    const [loginBtn, setLoginBtn] = useState(true);
    const [signupBtn, setSignupBtn] = useState(false);

    useEffect(() => {
        if (document.cookie.includes("user") && document.cookie.split("user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    const login_signup = (e) => {
        e.preventDefault();
        if (e.target.value === 'Log In') {
            setLoginBtn(true);
            setSignupBtn(false);
        } else if (e.target.value === 'Sign Up') {
            setLoginBtn(false);
            setSignupBtn(true);
        }
    }

    return (
        <>
            <Head>
                <title>{loginBtn ? "Log In" : "Sign Up"} | {name}</title>
            </Head>
            <div className='text-indigo-700 font-bold' style={{ position: "fixed", top: "20px", left: "20px" }}><Link href="/">Home</Link></div>
            <div className="flex justify-center w-56 m-auto pt-10">
                <input onClick={login_signup} type="submit" name="login" value="Log In" className={`rounded-l-full cursor-pointer ${loginBtn ? "text-white bg-black" : "text-black bg-white"} border-2 border-black py-2 px-6 focus:outline-none`} />
                <input onClick={login_signup} type="submit" name="signup" value="Sign Up" className={`rounded-r-full cursor-pointer ${signupBtn ? "text-white bg-black" : "text-black bg-white"} border-2 border-black py-2 px-6 focus:outline-none`} />
            </div>
            {loginBtn && <Login tst={tst} router={router} />}
            {signupBtn && <Signup tst={tst} router={router} />}
        </>
    )
}

export default Index;