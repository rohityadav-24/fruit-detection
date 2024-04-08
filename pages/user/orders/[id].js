import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ID = ({ name, response, router }) => {
    const [date, setDate] = useState();
    useEffect(() => {
        const d = new Date(response.data.data.createdAt);
        setDate(d);
    }, [router]);
    const products = response.data.data.products;
    return (
        <>
            <Head>
                <title>Order Details | {name}</title>
            </Head>

            <section className="text-gray-600 body-font overflow-hidden min-h-screen">
                <div className=" px-6 py-12 mt-10 mx-auto">
                    <div className="mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 mx-auto w-full lg:pr-10 lg:py-6 lg:mb-0 p-4 bg-gray-100 overflow-hidden">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">{name}</h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">Order ID : <span className='underline text-indigo-700'>#{response.data.data.orderId}</span></h1>
                            <p className="leading-relaxed mb-2">Your order has been successfully placed on : <span className="font-medium text-indigo-700">{date && date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                            <p className="leading-relaxed">Payment Status : <span className='font-semibold text-indigo-700'>{response.data.data.paymentStatus}</span></p>
                            <p className="leading-relaxed mb-2">Order Status : <span className='font-semibold text-indigo-700'>{response.data.data.orderStatus}</span></p>
                            {response.data.data.transactionId && <p className="leading-relaxed mb-3">Transaction ID : <span className='font-semibold text-indigo-700'>{response.data.data.transactionId}</span></p>}
                            <p className="leading-relaxed mb-4">Address : <span className='font-semibold text-indigo-700'>{response.data.data.address}, {response.data.data.city}, {response.data.data.state}, {response.data.data.pincode}</span></p>

                            <div className="flex flex-col">
                                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="py-2 inline-block min-w-full px-6 md:px-3">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full">
                                                <thead className="border-b">
                                                    <tr>
                                                        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">Name</th>
                                                        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-center">Quantity</th>
                                                        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.keys(products).map((item) => {
                                                        return <tr key={item} className="border-b">
                                                            <td className="text-left px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{products[item].name} <span className="capitalize">{(products[item].size && products[item].variant) ? `(${products[item].size}/${products[item].variant})` : (products[item].size ? `(${products[item].size})` : (products[item].variant ? `(${products[item].variant})` : ``))}</span></td>
                                                            <td className="text-center text-sm  text-gray-900 font-normal px-6 py-4 whitespace-nowrap">
                                                                {products[item].qty}
                                                            </td>
                                                            <td className="text-right text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap">
                                                                ₹{products[item].price} X  {products[item].qty} = ₹{products[item].price * products[item].qty}
                                                            </td>
                                                        </tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex mt-6">
                                {response.data.data.orderStatus === "Ordered" ? <p className="flex mr-auto font-bold uppercase text-yellow-500 text-xl">Processing</p> : response.data.data.orderStatus === "Shipped" ? <a target='_blank' rel='noreferrer' href={response.data.data.trackURL}><button className="flex mr-auto text-white bg-black hover:bg-gray-800 border-0 py-2 px-6 focus:outline-none">Track Order</button></a> : <p className="flex mr-auto font-bold uppercase text-green-500 text-xl">Delivered</p>}
                                <span className="title-font ml-auto font-medium text-2xl text-gray-900">Total : ₹{response.data.data.amount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ID;

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

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id: context.params.id, type: "single" }),
    });
    const res = await req.json();

    if (!res.data)
        return {
            redirect: {
                destination: '/user/orders',
                permanent: false,
            },
        }

    return {
        props: {
            response: { data: res, token: token }
        },
    };
}