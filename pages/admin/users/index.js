import React, { useState } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { Grid, Typography, Table, Box, TableBody, TableCell, TableHead, TableRow, Chip, Stack, Pagination } from "@mui/material";
import Main from '../../../src/Main';
import BaseCard from "../../../src/components/baseCard/BaseCard";

const Index = ({ name, response, user, logout }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    response.data.data.map((user, index) => {
        user.sno = index + 1;
    });

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentData = response.data.data.slice(startIndex, endIndex);

    return (
        <>
            <Head>
                <title>{`Users | ${name}`}</title>
            </Head>
            <Main name={name} user={user} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="All Users">
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
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Mobile
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6">
                                                    Role
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
                                        {Object.keys(currentData).map((user) => (
                                            <Link href={`/admin/users/${currentData[user]._id}`} key={currentData[user]._id}>
                                                <TableRow style={{ cursor: "pointer" }}>
                                                    <TableCell align='center'>
                                                        <Typography
                                                            sx={{
                                                                fontSize: "15px",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            {currentData[user].sno}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[user].name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[user].email}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[user].mobile}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Typography color="textSecondary" variant="h6" sx={{ textTransform: "capitalize" }}>
                                                            {currentData[user].role}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Chip
                                                            sx={{
                                                                pl: "4px",
                                                                pr: "4px",
                                                                backgroundColor: (currentData[user].verified && "success.dark") || "error.dark",
                                                                color: "#FFF",
                                                                fontWeight: "600",
                                                            }}
                                                            size="small"
                                                            label={currentData[user].verified && "Verified" || "Not Verified"}
                                                        ></Chip>
                                                    </TableCell>
                                                </TableRow>
                                            </Link>
                                        ))}
                                    </TableBody>
                                </> : <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="h6">No Users Found</Typography>
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

    const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/admin/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });
    const res = await req.json();

    const admin = res.data.filter(user => user.role === 'admin');
    const users = res.data.filter(user => user.role === 'user');
    res.data = [...admin, ...users];

    return {
        props: {
            response: { data: res, token: token }
        },
    };
}