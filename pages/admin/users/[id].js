import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Stack, TextField, Select, Button, Box } from "@mui/material";
import Main from '../../../src/Main';
import BaseCard from "../../../src/components/baseCard/BaseCard";

const ID = ({ name, user, logout, response, tst, router }) => {
    const [form, setForm] = useState(response.data);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/admin/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        });

        const res = await req.json();
        tst(res.message, res.type);
        router.push(router.asPath);
    }

    const handleDelete = async (e) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const id = router.query.id;
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/admin/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: response.data.token, id })
        });

        const res = await req.json();
        tst(res.message, res.type);
        router.push("/admin/users");
    }

    return (
        <>
            <Head>
                <title>{`User Details | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="User Details">
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
                                    <option value={"admin"}>Admin</option>
                                    <option value={"user"}>User</option>
                                </Select>

                                <Select
                                    native
                                    name='verified'
                                    value={form.verified.toString() || ""}
                                    onChange={handleChange}
                                    label="Verified"
                                >
                                    <option value={"true"}>Verified</option>
                                    <option value={"false"}>Not Verified</option>
                                </Select>

                            </Stack>
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button variant="contained" mt={2} onClick={handleSubmit}>Submit</Button>
                                <Button variant="contained" mt={2} onClick={(handleDelete)} color='error'>Delete</Button>
                            </Box>
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

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/admin/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: { _id: context.query.id }, token })
    });
    const res = await req.json();
    res.data[0].token = token;

    return {
        props: {
            response: { data: res.data[0] }
        },
    };
}