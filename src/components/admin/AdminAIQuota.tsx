'use client';

import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Box } from '@mui/material';

function AdminAIQuota() {
    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                AI Quota
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Monitor and manage AI credit usage across all merchants.
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ marginTop: '1.5rem', borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(89, 50, 234, 0.06)' }}>
                        <TableRow>
                            <TableCell><strong>Merchant</strong></TableCell>
                            <TableCell><strong>Credits Used</strong></TableCell>
                            <TableCell><strong>Credits Limit</strong></TableCell>
                            <TableCell><strong>Usage</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                                No AI quota data available.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AdminAIQuota;
