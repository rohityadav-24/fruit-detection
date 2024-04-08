import React, { useState } from 'react';
import axios from 'axios';

const Detect = () => {
    const [message, setMessage] = useState("");
    const [uploaded, setUploaded] = useState(false);

    const handleImageChange = async (event) => {
        setUploaded(false);
        setMessage("Loading...");

        const data = event.target.files[0];

        const formData = new FormData();
        formData.append('file', data);

        if (data === undefined) {
            return;
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_FDAPI_URL}/detect`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log({ response });

        if (response.data.result === false) {
            setMessage("Apple is not fresh.");
            return;
        }

        if (response.data.result === "na") {
            setMessage("Please upload an apple image.");
            return;
        }

        setUploaded(true);
        setMessage("Apple is fresh.");

    }

    return (
        <>
            <section className="text-gray-600 body-font">
                <div className="container w-full px-5 pt-28 pb-20 mx-auto flex justify-center items-center">
                    <form method="POST" className="w-1/2 bg-gray-100 p-8 flex flex-col mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Check the Freshness</h2>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Your Image</label>
                            <input type="file" onChange={handleImageChange} name="file" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <p className={`${uploaded ? "text-green-600" : "text-red-600"} ${message === "Loading..." && "!text-black"}`}>{message}</p>
                    </form>
                </div>
            </section >
        </>
    )
}

export default Detect