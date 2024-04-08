import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Index = ({ name, response }) => {
    return (
        <>
            <Head>
                <title>Orders | {name}</title>
            </Head>

            <section className="text-gray-600 body-font min-h-screen">
                <div className="container px-5 py-16 mx-auto">
                    <div className="flex flex-col text-center w-full mb-10">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Your Orders</h1>
                    </div>

                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="border-b">
                                            <tr>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Order ID</th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Name</th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Email</th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Mobile</th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Amount</th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(response.data.data.length > 0) && (response.data.data).map((item) => {
                                                return <tr key={item._id} className="bg-white border-b">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">#{item.orderId}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">{item.name}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">{item.email}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">{item.mobile}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">₹{item.amount}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                        <Link href={`/user/orders/${item._id}`}><a className='text-indigo-700 font-medium'>Track Now</a></Link>
                                                    </td>
                                                </tr>
                                            }) || <tr className="bg-white border-b"><td colSpan={7} className="px-6 py-4 whitespace-nowrap text-md font-bold text-indigo-700 text-center">No Orders Found</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
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

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, type: "all" }),
    });
    const res = await req.json();

    let arr = [];
    for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].paymentStatus === "Completed")
            arr.push(res.data[i]);
    }

    res.data = arr;

    return {
        props: {
            response: { data: res, token: token }
        },
    };
}