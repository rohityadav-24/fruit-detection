import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Stack, TextField, Select, Button } from "@mui/material";
import Main from '../../../src/Main';
import BaseCard from "../../../src/components/baseCard/BaseCard";

const Add = ({ name, user, logout, tst, router, response }) => {
    const [form, setForm] = useState({ token: response.data });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/admin/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        });

        const res = await req.json();
        tst(res.message, res.type);

        if (res.type === "success")
            router.push("/admin/users");
    }

    return (
        <>
            <Head>
                <title>{`Add User | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="Add User">
                            <Stack spacing={3}>
                                <TextField
                                    name='name'
                                    value={form.name || ""}
                                    onChange={handleChange}
                                    label="Name"
                                    variant="outlined"
                                />
                                <TextField
                                    name='email'
                                    value={form.email || ""}
                                    onChange={handleChange}
                                    label="Email"
                                    variant="outlined"
                                />
                                <TextField
                                    name='password'
                                    value={form.password || ""}
                                    onChange={handleChange}
                                    label="Password"
                                    variant="outlined"
                                />
                                <TextField
                                    name='mobile'
                                    value={form.mobile || ""}
                                    onChange={handleChange}
                                    label="Mobile"
                                    variant="outlined"
                                />
                                <TextField
                                    name='address'
                                    value={form.address || ""}
                                    onChange={handleChange}
                                    label="Address"
                                    multiline
                                    rows={4}
                                />
                                <TextField
                                    name='city'
                                    value={form.city || ""}
                                    onChange={handleChange}
                                    label="City"
                                    variant="outlined"
                                />
                                <TextField
                                    name='pincode'
                                    value={form.pincode || ""}
                                    onChange={handleChange}
                                    label="Pincode"
                                    variant="outlined"
                                />
                                <Select
                                    native
                                    name='role'
                                    value={form.role || ""}
                                    onChange={handleChange}
                                    label="Role"
                                >
                                    <option>Choose Role</option>
                                    <option value={"admin"}>Admin</option>
                                    <option value={"user"}>User</option>
                                </Select>

                            </Stack>
                            <br />
                            <Button variant="contained" mt={2} onClick={handleSubmit}>Submit</Button>
                        </BaseCard>
                    </Grid>
                </Grid>
            </Main>
        </>
    )
}

export default Add;

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

    return {
        props: {
            response: { data: token }
        },
    };
}