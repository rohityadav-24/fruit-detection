import React, { useState } from 'react'
import Head from 'next/head';
import axios from 'axios';

import { Grid, Stack, TextField, Select, Button } from "@mui/material";
import Main from '../../../src/Main';
import BaseCard from "../../../src/components/baseCard/BaseCard";

const Add = ({ name, user, logout, tst, router, response }) => {
    const [form, setForm] = useState({ token: response.data });
    const [uploaded, setUploaded] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

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

        if (response.data.type === "success") {
            setMessage(response.data.result);
            setUploaded(response.data.result.includes("is fresh."));

            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

            const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);

            setForm({
                ...form,
                image: res.data.secure_url
            });
            return;
        }

        setMessage("Failed to upload image.");
    }

    const handleSubmit = async (e) => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        });

        const res = await req.json();
        tst(res.message, res.type);

        if (res.type === "success")
            router.push("/admin/products");
    }

    return (
        <>
            <Head>
                <title>{`Add Product | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="Add Product">
                            <Stack spacing={3}>
                                <TextField
                                    name='title'
                                    value={form.title || ""}
                                    onChange={handleChange}
                                    label="Title"
                                    variant="outlined"
                                />
                                <TextField
                                    name='slug'
                                    value={form.slug || ""}
                                    onChange={handleChange}
                                    label="Slug"
                                    variant="outlined"
                                />
                                <TextField type="file" name="name" onChange={handleImageChange} />
                                <p className={`${uploaded ? "text-green-600" : "text-red-600"} ${message === "Loading..." && "!text-black"}`}>{message}</p>
                                <TextField
                                    name='price'
                                    value={form.price || ""}
                                    onChange={handleChange}
                                    label="Price"
                                    variant="outlined"
                                />
                                <TextField
                                    name='availableQuantity'
                                    value={form.availableQuantity || ""}
                                    onChange={handleChange}
                                    label="Quantity"
                                    variant="outlined"
                                />

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