import React, { useState } from 'react';
import Head from 'next/head';

const Index = ({ name, response, router, tst }) => {
    const [form, setForm] = useState(response.data.data);

    const checkError = (resp, mode) => {
        if (resp.type === "success") {
            tst(`${mode} updated successfully`, "success");
            setTimeout(() => {
                router.push("/user");
            }, 2000);
        } else {
            tst(resp.message, "error");
        }
    }

    const updateUser = async (data, path) => {
        let updated = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await updated.json();
    }

    const updateDetails = async () => {
        let data = {
            token: response.token,
            name: form.name,
            mobile: form.mobile,
            address: form.address,
            pincode: form.pincode,
            city: form.city
        }
        let res = await updateUser(data, "update");
        checkError(res, "Details");
    }
    const updatePassword = async () => {
        let data = {
            token: response.token,
            password: form.currentPassword,
            newPassword: form.newPassword,
            confirmNewPassword: form.confirmNewPassword
        }
        if (form.currentPassword && form.newPassword && form.confirmNewPassword) {
            let res = await updateUser(data, "changepassword");
            checkError(res, "Password");
            setForm({ ...form, currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } else {
            tst("Please fill all the fields", "error");
        }
    }

    const handleChange = async (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name == "pincode" && e.target.value.length == 6) {
            let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
            let pinData = await pins.json();
            if (Object.keys(pinData).includes(e.target.value))
                setForm({ ...form, pincode: e.target.value, city: pinData[e.target.value][0] });
            else
                setForm({ ...form, pincode: e.target.value, city: "" });
        }
    }
    return (
        <>
            <Head>
                <title>Profile | {name}</title>
            </Head>
            <section className="text-gray-600 body-font relative min-h-screen">
                <div className="px-5 md:px-0 pt-16 pb-10 mx-auto">
                    <div className="flex flex-col text-center w-full mb-10">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">Update Your Account</h1>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">Full Name</label>
                                    <input type="text" name="name" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.name || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="mobile" className="leading-7 text-sm text-gray-600">Mobile Number</label>
                                    <input type="text" name="mobile" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.mobile || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label htmlFor="address" className="leading-7 text-sm text-gray-600">Full Address</label>
                                    <textarea type="text" name="address" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.address || ""} onChange={handleChange}></textarea>
                                </div>
                            </div>
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
                                    <input type="text" name="pincode" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.pincode || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="city" className="leading-7 text-sm text-gray-600">Town/City</label>
                                    <input type="text" name="city" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.city || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <button onClick={updateDetails} className="w-full flex justify-center mx-auto text-white bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg">Update Now</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 md:px-0 pb-16 mx-auto">
                    <div className="flex flex-col text-center w-full mb-6">
                        <h1 className="sm:text-2xl text-xl text-gray-900">Change the password</h1>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email Address</label>
                                    <input type="email" name="email" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.email || ""} readOnly />
                                </div>
                            </div>
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="currentPassword" className="leading-7 text-sm text-gray-600">Current Password</label>
                                    <input type="password" name="currentPassword" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.currentPassword || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="newPassword" className="leading-7 text-sm text-gray-600">New Password</label>
                                    <input type="password" name="newPassword" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.newPassword || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 md:w-1/2 w-full">
                                <div className="relative">
                                    <label htmlFor="confirmNewPassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
                                    <input type="password" name="confirmNewPassword" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" value={form.confirmNewPassword || ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <button onClick={updatePassword} className="w-full flex justify-center mx-auto text-white bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Index;

export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const cookie = cookies && cookies.split(';').map(cookie => cookie.split('=')).reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: decodeURIComponent(value) }), {});
    const token = cookie && cookie['user'];

    if (!token)
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            },
        }

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });
    const res = await req.json();

    return {
        props: {
            response: { data: res, token: token }
        },
    };
}