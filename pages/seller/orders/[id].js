import React, { useState } from 'react'
import { Grid, Stack, TextField, Select, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Box, InputLabel } from "@mui/material";
import BaseCard from "../../../src/components/baseCard/BaseCard";
import Head from 'next/head';
import Main from '../../../src/Main';

const ID = ({ name, user, logout, response, tst, router }) => {
    const [form, setForm] = useState(response.data);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/seller`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderStatus: form.orderStatus,
                paymentStatus: form.paymentStatus,
                id: router.query.id,
                trackURL: form.trackURL,
                token: response.token,
                type: "update"
            })
        });

        const res = await req.json();
        tst(res.message, res.type);
        router.push(router.asPath);
    }

    // const handleDelete = async (e) => {
    //     if (!confirm("Are you sure you want to delete this order?")) return;

    //     const id = router.query.id;
    //     const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/seller`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ token: response.token, id, type: "delete" })
    //     });

    //     const res = await req.json();
    //     tst(res.message, res.type);
    //     router.push("/seller/orders");
    // }

    return (
        <>
            <Head>
                <title>{`Order Details | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="Order Details">
                            <Box>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Order ID : </Typography>#{response.data.orderId}</Typography>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Name : </Typography>{response.data.name}</Typography>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Email ID : </Typography>{response.data.email}</Typography>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Mobile : </Typography>{response.data.mobile}</Typography>
                                <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Delivery Address : </Typography>{response.data.address}, {response.data.city}, {response.data.state}, {response.data.pincode}</Typography>
                                <Typography component="div"
                                    sx={{
                                        color: (response.data.mode === "UPI" && response.data.paymentStatus === "Initiated") && "error.dark" ||
                                            (response.data.orderStatus === "Delivered" && "success.dark") ||
                                            (response.data.orderStatus === "Shipped" && "secondary.dark") ||
                                            (response.data.orderStatus === "Ordered" && "warning.dark"),
                                        fontWeight: "bold",
                                        fontSize: "h4.fontSize"
                                    }}
                                ><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Order Status : </Typography>
                                    {((response.data.mode === "UPI" && response.data.paymentStatus === "Initiated") && "Failed") ||
                                        (response.data.orderStatus === "Ordered" && "Pending") || response.data.orderStatus}
                                </Typography>
                                <Typography component="div"
                                    sx={{
                                        color: (response.data.mode === "UPI" && response.data.paymentStatus === "Initiated") && "error.dark" ||
                                            (response.data.paymentStatus === "Completed" && "success.dark") ||
                                            (response.data.paymentStatus === "Initiated" && "warning.dark"),
                                        fontWeight: "bold",
                                        fontSize: "h4.fontSize"
                                    }}
                                ><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Payment Status : </Typography>
                                    {((response.data.mode === "UPI" && response.data.paymentStatus === "Initiated") && "Not Paid") ||
                                        (response.data.paymentStatus === "Initiated" && "Pending") || response.data.paymentStatus}
                                </Typography>
                                {response.data.transactionId && <Typography component="div" sx={{ fontSize: "h4.fontSize", fontWeight: "500" }}><Typography color={"primary"} sx={{ fontWeight: "bold" }} component={"span"}>Transaction ID : </Typography>{response.data.transactionId}</Typography>}
                            </Box>
                            <Table
                                aria-label="simple table"
                                sx={{
                                    mt: "20px",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='left'>
                                            <Typography color="textSecondary" variant="h6">
                                                S.No.
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <Typography color="textSecondary" variant="h6">
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography color="textSecondary" variant="h6">
                                                Quantity
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography color="textSecondary" variant="h6">
                                                Amount
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(response.data.products).map((prod, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell align='left'>
                                                <Typography
                                                    sx={{
                                                        fontSize: "15px",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {ind + 1}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography color="textSecondary" variant="h6">
                                                    {response.data.products[prod].name}{" "}
                                                    <Typography component={"span"} sx={{ textTransform: "capitalize" }}>
                                                        {(response.data.products[prod].size && response.data.products[prod].variant) ? `(${response.data.products[prod].size}/${response.data.products[prod].variant})` : (response.data.products[prod].size ? `(${response.data.products[prod].size})` : (response.data.products[prod].variant ? `(${response.data.products[prod].variant})` : ``))}
                                                    </Typography>
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    {response.data.products[prod].qty}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='right'>
                                                <Typography color="textSecondary" variant="h6">
                                                    ₹{response.data.products[prod].price} X  {response.data.products[prod].qty} = ₹{response.data.products[prod].price * response.data.products[prod].qty}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography component="div" variant="h3" sx={{ fontWeight: "bold", mt: "20px" }}>Total Amount : ₹{response.data.amount}</Typography>
                            </Box>
                        </BaseCard>

                        <BaseCard title="Update Order">
                            <Stack spacing={3}>
                                <TextField
                                    name='trackURL'
                                    value={form.trackURL || ""}
                                    onChange={handleChange}
                                    label="Tracking URL"
                                    variant="standard"
                                />

                                <InputLabel id="orderStatus">Order Status</InputLabel>
                                <Select
                                    native
                                    variant="standard"
                                    name='orderStatus'
                                    value={form.orderStatus || ""}
                                    onChange={handleChange}
                                    label="Order Status"
                                    labelId="orderStatus"
                                >
                                    <option value={"Ordered"}>Pending</option>
                                    <option value={"Shipped"}>Shipped</option>
                                    <option value={"Delivered"}>Delivered</option>
                                </Select>

                                <InputLabel id="paymentStatus">Payment Status</InputLabel>
                                <Select
                                    native
                                    variant="standard"
                                    name='paymentStatus'
                                    value={form.paymentStatus || ""}
                                    onChange={handleChange}
                                    label="Payment Status"
                                    labelId="paymentStatus"
                                >
                                    <option value={"Initiated"}>Initiated</option>
                                    <option value={"Completed"}>Completed</option>
                                </Select>
                            </Stack>
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button variant="contained" mt={2} color="primary" onClick={handleSubmit}>Submit</Button>
                                {/* <Button variant="contained" mt={2} color="error" onClick={(handleDelete)}>Delete</Button> */}
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
        body: JSON.stringify({ id: context.query.id, type: "single", token })
    });
    const res = await req.json();

    return {
        props: {
            response: { data: res.data, token: token }
        },
    };
}