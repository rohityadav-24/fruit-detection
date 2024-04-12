import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Pagination, Stack, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip } from "@mui/material";
import Main from '../../../src/Main';
import BaseCard from "../../../src/components/baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";

const Products = ({ name, response, user, tst, router, logout }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    response.data.data.map((product, index) => {
        product.sno = index + 1;
    });

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentData = response.data.data.slice(startIndex, endIndex);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: response.token, id })
        });

        const res = await req.json();
        tst(res.message, res.type);
        router.push("/seller/products");
    }

    return (
        <>
            <Head>
                <title>{`Products | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="All Products">
                            <Table
                                aria-label="simple table"
                                sx={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {Object.keys(currentData).length ? <>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    S.No.
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Title
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Quantity
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Status
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Action
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(currentData).map((product) => (
                                            <TableRow style={{ cursor: "pointer" }} key={currentData[product]._id}>
                                                <TableCell align='center'>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "15px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {currentData[product].sno}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: "600",
                                                                }}
                                                            >
                                                                {currentData[product].title}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        ₹{currentData[product].price}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentData[product].availableQuantity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Chip
                                                        sx={{
                                                            pl: "4px",
                                                            pr: "4px",
                                                            backgroundColor: currentData[product].availableQuantity === 0 ? "error.dark" : currentData[product].availableQuantity <= 5 ? "warning.dark" : "success.dark",
                                                            color: "#FFF",
                                                            fontWeight: "600",
                                                        }}
                                                        size="small"
                                                        label={currentData[product].availableQuantity === 0 ? "Out of Stock" : currentData[product].availableQuantity <= 5 ? "Low Stock" : "In Stock"}
                                                    ></Chip>
                                                </TableCell>
                                                <TableCell align='center' sx={{ height: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                                                        <FeatherIcon
                                                            style={{
                                                                color: `red`,
                                                                cursor: "pointer"
                                                            }}
                                                            icon={'trash-2'}
                                                            width="20"
                                                            height="20"
                                                            onClick={() => { handleDelete(currentData[product]._id) }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                {/* <TableCell align='center'>
                                                    <MdDelete onClick={() => handleDelete(currentData[product]._id)} className='mx-auto text-red-600' size={"25px"} />
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </> : <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="h6">No Products Found</Typography>
                                    </TableCell>
                                </TableRow>}
                            </Table>

                            <Box mt={3} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Stack spacing={2}>
                                    <Pagination
                                        color="primary"
                                        count={Math.ceil(response.data.data.length / 10)}
                                        page={currentPage}
                                        onChange={handleChangePage}
                                    />
                                </Stack>
                            </Box>
                        </BaseCard>
                    </Grid>
                </Grid>
            </Main>

        </>
    );
};

export default Products;

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

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/get`, {
        method: "POST",
        body: JSON.stringify({ query: { seller_id: sellerRes.data.id } }),
        headers: {
            "Content-Type": "application/json",
        }
    });
    const res = await req.json();

    return {
        props: {
            response: { data: res, token: token }
        },
    };
}