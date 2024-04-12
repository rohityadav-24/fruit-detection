import React from 'react'
import Head from 'next/head';
import { Grid } from "@mui/material";
import Main from '../../src/Main';
import SalesOverview from "../../src/components/dashboard/SalesOverview";
import ProductPerfomance from "../../src/components/dashboard/ProductPerfomance";

const Index = ({ name, user, logout, response }) => {
    const d = response.data.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${month}-${year}`;
        if (acc[key]) {
            acc[key].push(order);
        } else {
            acc[key] = [order];
        }
        return acc;
    }, {});

    const currentYear = new Date().getFullYear();

    let data = [];
    for (let i = 0; i <= 11; i++) {
        const key = `${i - 1}-${currentYear}`;
        let count = 0;
        if (d[key]) {
            count = d[key].length;
        }
        data.push(count);
    }

    // data = [5, 8, 3, 4, 9, 2, 5, 3, 1, 5, 3, 8];

    // find all the products from the orders and count the number of times they appear
    const products = response.data.map((order, index) => {
        for (let item in order.products) {
            return order.products[item];
        }
    }, []);

    const slugCounts = {};
    products.forEach(item => {
        const slug = item.name;
        const qty = item.qty;
        if (slugCounts[slug]) {
            slugCounts[slug] += qty;
        } else {
            slugCounts[slug] = qty;
        }
    });

    const productData = [];
    for (let slug in slugCounts) {
        productData.push({ slug, qty: slugCounts[slug] });
    }

    productData.sort((a, b) => b.qty - a.qty);
    productData.splice(5);

    console.log({ products, productData });

    return (
        <>
            <Head>
                <title>{`Dashboard | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <SalesOverview orders={data} />
                        <ProductPerfomance data={productData} />
                    </Grid>
                </Grid>
            </Main>
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

    const sellerReq = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });
    const sellerRes = await sellerReq.json();

    if (!sellerRes.data) {
        context.res.setHeader('Set-Cookie', `user=; path=/;`);
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            },
        }
    }

    if (sellerRes.data.role !== 'seller')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/seller`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, type: "all" })
    });
    const res = await req.json();

    return {
        props: {
            response: { data: res && res.data, token: token }
        },
    };
}