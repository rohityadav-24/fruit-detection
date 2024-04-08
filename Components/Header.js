import React, { useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Header = ({ name, user, logout }) => {
    const [dropDown, setDropDown] = useState(false)
    const toggleDropDown = () => {
        setDropDown(!dropDown);
    }

    return (
        <>
            <header className="text-gray-600 body-font bg-white sticky top-0 z-10 shadow-md">
                <div className="container mx-auto flex flex-wrap px-5 pb-5 pt-5 flex-col md:flex-row items-center">
                    <Link href={"/"}>
                        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-black rounded-full" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span className="ml-3 text-xl">{name}</span>
                        </a>
                    </Link>
                    <nav className="mx-auto px-5 flex flex-wrap items-center text-base justify-center">
                        <Link href={"/"}><a className="ml-2 mr-2 hover:text-gray-900">Home</a></Link>
                        <Link href={"/about"}><a className="ml-2 mr-2 hover:text-gray-900">About</a></Link>
                        <Link href={"/products"}><a className="ml-2 mr-2 hover:text-gray-900">All Products</a></Link>
                        <Link href={"/check"}><a className="ml-2 mr-2 hover:text-gray-900">Check</a></Link>
                        <Link href={"/contact"}><a className="ml-2 mr-2 hover:text-gray-900">Contact</a></Link>
                        {!user.token && <Link href={"/auth"}><a className="ml-2 mr-2 hover:text-gray-900">Login</a></Link>}
                    </nav>
                    <div className="absolute right-0 top-5 mx-5 px-5 flex mt-2 md:mt-0">
                        {user.token &&
                            <>
                                <a className='mx-3 cursor-pointer'>
                                    <FaUserCircle onMouseOver={() => setDropDown(true)} onMouseLeave={() => setDropDown(false)} className='text-2xl' />
                                </a>
                                {dropDown && <div onMouseOver={() => setDropDown(true)} onMouseLeave={() => setDropDown(false)} className="absolute right-0 top-5 px-5 py-2 bg-white border shadow-lg" style={{ width: "130px" }}>
                                    <ul>
                                        <Link href={"/user"}><a><li className='my-2'>My Account</li></a></Link>
                                        <Link href={"/user/orders"}><a><li className='my-2'>My Orders</li></a></Link>
                                        {(user.user.role === "admin") && <Link href={"/admin"}><a><li className='my-2'>Admin</li></a></Link>}
                                        <li onClick={logout} className='cursor-pointer text-red-500 my-2'><a>Logout</a></li>
                                    </ul>
                                </div>}
                            </>
                        }

                        <Link href={"/cart"}>
                            <a className='ml-3'><FaShoppingCart className='text-2xl' /></a>
                        </Link>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header