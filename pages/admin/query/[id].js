import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Button, Typography, Box } from "@mui/material";
import Main from '../../../src/Main';
import BaseCard from "../../../src/components/baseCard/BaseCard";

const ID = ({ name, user, logout, response }) => {

    return (
        <>
            <Head>
                <title>{`Query Details | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="Query Details">
                            <Box>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Name : </Typography>{response.data.name}</Typography>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Email ID : </Typography>{response.data.email}</Typography>
                                <Typography component="div"
                                    sx={{
                                        color: response.data.status === "Pending" && "warning.dark" ||
                                            (response.data.status === "Resolved" && "success.dark"),
                                        fontWeight: "bold",
                                        fontSize: "h4.fontSize"
                                    }}
                                ><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Status : </Typography>{response.data.status}</Typography>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Subject : </Typography>{response.data.subject}</Typography>
                                <BaseCard title="Message">
                                    <Typography component={"div"} sx={{ fontSize: "h6.fontSize", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: response.data.message }}></Typography>
                                </BaseCard>
                                {response.data.reply && <BaseCard title="Response">
                                    <Typography component={"div"} sx={{ fontSize: "h6.fontSize", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: response.data.reply }}></Typography>
                                </BaseCard>}
                            </Box>
                            {response.data.reply && <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button variant="contained" mt={2} color="error" onClick={(handleDelete)}>Delete</Button>
                            </Box>}
                        </BaseCard>
                    </Grid>
                </Grid>
            </Main>
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

    const adminReq = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });
    const adminRes = await adminReq.json();

    if (!adminRes.data) {
        context.res.setHeader('Set-Cookie', `user=; path=/;`);
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            },
        }
    }

    if (adminRes.data.role !== 'admin')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, type: "GET_DATA", query: { _id: context.query.id } })
    });
    const res = await req.json();

    return {
        props: {
            response: { data: res && res.data[0], token }
        },
    };
}