import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link';

const Reset = ({ router, name }) => {
    const [msg, setMsg] = useState("");
    const [type, setType] = useState("");
    const [count, setCount] = useState(5);

    const counter = () => {
        setInterval(() => {
            (count > 0) && setCount(count - 1);
        }, 1000);
        return count > 1 ? `${count} seconds` : `${count} second`;
    }

    useEffect(() => {
        if (document.cookie.includes("user") && document.cookie.split("user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    useEffect(() => {
        const verify = async () => {
            const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: router.query.code,
                    id: router.query.user
                })
            });
            const res = await req.json();
            setMsg(res.message);
            setType(res.type);
            setTimeout(() => {
                router.push("/auth");
            }, 5000);
        }

        verify();
    }, [router.query.code, router.query.user]);

    return (
        <>
            <Head>
                <title>Verification | {name}</title>
            </Head>
            <section className="flex justify-center items-center min-h-screen w-full">
                {(router.query.code && router.query.code) && <div className="text-center md:w-1/2 bg-gray-100 p-8 flex flex-col w-full mt-10 mx-5">
                    <h2 className="text-gray-900 text-4xl mb-5">Verification</h2>
                    <div className="relative mb-4">
                        <p className={`text-center font-bold ${type === "error" && "text-red-700" || "text-green-700"}`}>{msg}</p>
                        <p className='text-center'>You will be automatically redirected to login page in <b className='text-indigo-700'>{counter()}</b> <br />or click the button to login.</p>
                    </div>
                    <Link href="/auth"><a className="d-block text-white cursor-pointer bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg">Login</a></Link>
                </div>}
            </section>
        </>
    )
}

export default Reset;