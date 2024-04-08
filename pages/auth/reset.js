import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link';

const Reset = ({ router, tst, name }) => {
    useEffect(() => {
        if (document.cookie.includes("user") && document.cookie.split("user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    const [form, setForm] = useState({});

    const apiRequest = async (data) => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    }

    const checkError = (resp, mode, route) => {
        if (resp.type === "success") {
            tst(mode, "success");
            setTimeout(() => {
                router.push(route);
            }, 2000);
        } else {
            tst(resp.message, "error");
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault();
        const { email } = form;
        if (email) {
            const data = { email, sendMail: true, siteName: name };
            let response = await apiRequest(data);
            checkError(response, "Email Sent Successfully", "/auth");
        } else {
            tst("Please enter your email", "error");
        }
        setForm({});
    }

    const setNewPass = async (e) => {
        e.preventDefault();
        let token = router.query.code;
        const id = router.query.user;
        const { newPassword, confirmNewPassword } = form;

        if (newPassword && confirmNewPassword) {
            if (newPassword === confirmNewPassword) {
                const data = { token, id, sendMail: false, newPassword, confirmNewPassword };
                let response = await apiRequest(data);
                checkError(response, "Password Updated Successfully", "/auth");
            } else {
                tst("Password does not match", "error");
            }
        } else {
            tst("Please fill all the fields", "error");
        }
        setForm({});
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <Head>
                <title>{router.query.code ? "Set New Password" : "Reset Password"} | {name}</title>
            </Head>
            <section className=" flex justify-center items-center min-h-screen w-full">
                {!(router.query.code && router.query.code) && <form onSubmit={resetPassword} method="POST" className="md:w-1/2 bg-gray-100 p-8 flex flex-col w-full mt-10 mx-5">
                    <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Reset Password</h2>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email Address</label>
                        <input onChange={handleChange} value={form.email || ""} type="email" name="email" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                    </div>
                    <Link href={"/auth"}><a className='text-indigo-700 font-medium mb-2'>Login</a></Link>
                    <input type="submit" value={"Reset Now"} className="text-white cursor-pointer bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg" />
                </form>}

                {(router.query.code && router.query.code) && <form onSubmit={setNewPass} method="POST" className="md:w-1/2 bg-gray-100 p-8 flex flex-col w-full mt-10 mx-5">
                    <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Set Password</h2>
                    <div className="relative mb-4">
                        <label htmlFor="newPassword" className="leading-7 text-sm text-gray-600">New Password</label>
                        <input onChange={handleChange} value={form.newPassword || ""} type="password" name="newPassword" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="confirmNewPassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
                        <input onChange={handleChange} value={form.confirmNewPassword || ""} type="password" name="confirmNewPassword" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                    </div>
                    <input type="submit" value={"Set Now"} className="text-white cursor-pointer bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg" />
                </form>}

            </section>
        </>
    )
}

export default Reset;