import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedin } from 'react-icons/fa';

const Footer = ({ name, tst }) => {
    const copyright = (year) => {
        const currYear = new Date().getFullYear();
        return currYear === year ? year : `${year}-${currYear % 100}`;
    }

    const subscribe = async (e) => {
        e.preventDefault();
        const data = { email: e.target.subscribe.value };
        console.log(process.env.NEXT_PUBLIC_HOST);
        const sub = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/subscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        let response = await sub.json();
        tst(response.message, response.type);
        e.target.subscribe.value = "";
    }
    return (
        <>
            <footer className="text-gray-600 body-font bg-gray-100">
                <div className="container px-5 py-4 md:pt-20 mx-auto">
                    <div className="flex justify-between flex-col md:flex-row text-left">
                        <div className="lg:w-1/3 md:w-1/2 w-full mt-3 md:mt-0">
                            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">SUBSCRIBE NOW</h2>
                            <div className="flex flex-col">
                                <p className="leading-7 text-sm text-gray-600">To be one of the first to know about the new products, discounts, updates and more.</p>
                                <form onSubmit={subscribe} className="flex justify-between w-full md:mb-10">
                                    <input type="text" id="subscribe" name="subscribe" className="w-full mr-2 bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-transparent focus:border-black text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-300 ease-in-out" />
                                    <button className="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800">Subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-gray-300'>
                    <div className="container px-5 py-6 mx-auto flex items-center md:flex-row flex-col">
                        <p className="text-sm text-gray-500 text-center md:text-start md:mt-0 mt-4">
                            Copyright &copy; {copyright(2024)}, All Rights Reserved by <span className="font-bold">{name}</span>. <br />
                            {/* <span>Designed &amp; Developed by <a href="https://theritiktiwari.vercel.app" target="_blank" rel="noreferrer" className='font-bold'>Ritik Tiwari</a>.</span> */}
                        </p>
                        <span className="flex md:ml-auto md:mt-0 mt-4 justify-center md:justify-end">
                            <a className="ml-3 text-gray-500 text-xl hover:text-blue-500 transition-colors duration-300 ease-in-out" href="#">
                                <FaFacebookF />
                            </a>
                            <a className="ml-3 text-gray-500 text-xl hover:text-blue-300 transition-colors duration-300 ease-in-out" href="#">
                                <FaTwitter />
                            </a>
                            <a className="ml-3 text-gray-500 text-xl hover:text-pink-700 transition-colors duration-300 ease-in-out" href="#">
                                <FaInstagram />
                            </a>
                            <a className="ml-3 text-gray-500 text-xl hover:text-blue-700 transition-colors duration-300 ease-in-out" href="#">
                                <FaLinkedin />
                            </a>
                        </span>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer