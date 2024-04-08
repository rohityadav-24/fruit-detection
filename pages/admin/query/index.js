import React, { useState } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { Typography, Grid, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow, Chip, Box } from "@mui/material";
import Main from '../../../src/Main'
import BaseCard from "../../../src/components/baseCard/BaseCard";

const Index = ({ name, user, logout, response }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    response.data.map((order, index) => {
        order.sno = index + 1;
    });

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentData = response.data.slice(startIndex, endIndex);
    return (
        <>
            <Head>
                <title>{`Queries | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="All Queries">
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
                                                    Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Email
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Subject
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Status
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(currentData).map((item) => (
                                            <Link href={`/admin/query/${currentData[item]._id}`} key={currentData[item]._id}>
                                                <TableRow style={{ cursor: "pointer" }}>
                                                    <TableCell align='center'>
                                                        <Typography
                                                            sx={{
                                                                fontSize: "15px",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            {currentData[item].sno}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[item].name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[item].email}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[item].subject.substring(0, 20)}...
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Chip
                                                            sx={{
                                                                pl: "4px",
                                                                pr: "4px",
                                                                backgroundColor: (currentData[item].status === "Pending" && "warning.dark") ||
                                                                    (currentData[item].status === "Resolved" && "success.dark"),
                                                                color: "#FFF",
                                                                fontWeight: "600",
                                                            }}
                                                            size="small"
                                                            label={currentData[item].status}
                                                        ></Chip>
                                                    </TableCell>
                                                </TableRow>
                                            </Link>
                                        ))}
                                    </TableBody>
                                </> : <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="h6">No Queries Found</Typography>
                                    </TableCell>
                                </TableRow>}
                            </Table>

                            <Box mt={3} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Stack spacing={2}>
                                    <Pagination
                                        color="primary"
                                        count={Math.ceil(response.data.length / 10)}
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
        body: JSON.stringify({ token, type: "GET_DATA" })
    });
    const res = await req.json();

    return {
        props: {
            response: { data: res && res.data, token: token }
        },
    };
}