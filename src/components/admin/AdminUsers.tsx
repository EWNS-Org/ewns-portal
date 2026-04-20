'use client';

import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

function AdminUsers() {
    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Users
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                View and manage all users on the EWNS platform.
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ marginTop: '1.5rem', borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(89, 50, 234, 0.06)' }}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Joined</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                                No user data available.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AdminUsers;
