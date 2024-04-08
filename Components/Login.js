import React, { useState } from 'react';
import Link from 'next/link';

const Login = ({ tst, router }) => {

    const [form, setForm] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: form.email,
            password: form.password
        };
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        let response = await res.json();

        if (response.type == "success") {
            document.cookie = `user=${response.token}; path=/; expires=${new Date(Date.now() + 86400000)};`;
            setTimeout(() => {
                router.push("/");
            }, 1500);
        }
        tst(response.message, response.type);
        setForm({});
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    return (
        <>
            <section className="text-gray-600 body-font ">
                <div className="container px-5 pt-28 pb-20 mx-auto flex flex-wrap items-center">
                    <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                        <h1 className="title-font font-medium text-3xl text-gray-900">Hello! My Friend, Welcome Back</h1>
                        <p className="leading-relaxed mt-4">Continue the journey with us where you have left.</p>
                    </div>
                    <form onSubmit={handleSubmit} method="POST" className="lg:w-2/6 md:w-1/2 bg-gray-100 p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Log In</h2>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email Address</label>
                            <input onChange={handleChange} value={form.email || ""} type="email" name="email" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input onChange={handleChange} value={form.password || ""} type="password" name="password" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <Link href={"/auth/reset"}><a className='text-indigo-700 font-medium mb-2'>Forget Password ?</a></Link>
                        <input type="submit" value={"Login"} className="text-white cursor-pointer bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg" />
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login