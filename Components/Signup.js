import React, { useState } from 'react';

const Signup = ({ tst }) => {
    const [form, setForm] = useState({});
    const { name, email, password, confirmPassword, mobile, role } = form;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            const data = { name, email, password, mobile, role };
            let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            let response = await res.json();
            tst(response.message, response.type);
            response.type == "success" && setForm({});
        } else {
            tst("Password did not match", "error");
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    return (
        <>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-10 mx-auto flex flex-wrap items-center flex-col-reverse md:flex-row">
                    <form onSubmit={handleSubmit} method="POST" className=" lg:w-2/6 md:w-1/2 bg-gray-100 p-8 flex flex-col md:mr-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
                        <div className="relative mb-4">
                            {/* <label htmlFor="role" className="leading-7 text-sm text-gray-600">Select Role</label> */}
                            <select onChange={handleChange} value={form.role || ""} name="role" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8">
                                <option hidden>Select Role</option>
                                <option value="user">User</option>
                                <option value="seller">Seller</option>
                            </select>
                            {/* <input onChange={handleChange} value={form.name || ""} type="text" name="name" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" /> */}
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-600">User Name</label>
                            <input onChange={handleChange} value={form.name || ""} type="text" name="name" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                            <input onChange={handleChange} value={form.email || ""} type="email" name="email" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="mobile" className="leading-7 text-sm text-gray-600">Mobile</label>
                            <input onChange={handleChange} value={form.mobile || ""} type="number" name="mobile" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input onChange={handleChange} value={form.password || ""} type="password" name="password" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="confirmPassword" className="leading-7 text-sm text-gray-600">Confirm Password</label>
                            <input onChange={handleChange} value={form.confirmPassword || ""} type="password" name="confirmPassword" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <input type='submit' value="Signup" className="text-white cursor-pointer bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg" />
                    </form>

                    <div className="lg:w-3/5 md:w-1/2 md:pl-16 lg:pl-0 pl-0">
                        <h1 className="title-font text-left lg:text-right mx-0 lg:mx-16 font-medium text-3xl text-gray-900">Hello! My Friend, Join With Us</h1>
                        <p className="leading-relaxed text-left lg:text-right mx-0 lg:mx-16 mt-4">There is a spot left only for the right person as you, join us.</p>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Signup