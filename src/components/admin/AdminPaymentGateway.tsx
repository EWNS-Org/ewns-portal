'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, TextField, Button,
    Chip, CircularProgress, InputAdornment, IconButton, Tooltip, Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    getThirdPartyConfigsByCategory,
    upsertThirdPartyConfig,
    setActiveThirdPartyProvider,
    deleteThirdPartyConfig,
} from '@/services/api/admin.thirdparty.service';

// ─── Provider Field Definitions ───────────────────────────────────────────────

const PROVIDER_FIELDS: Record<string, { key: string; label: string }[]> = {
    PAYU: [
        { key: 'key', label: 'Key' },
        { key: 'salt32', label: 'Salt-32' },
        { key: 'salt256', label: 'Salt-256' },
        { key: 'clientId', label: 'Client ID' },
        { key: 'clientSecret', label: 'Client Secret' },
    ],
    RAZORPAY: [
        { key: 'keyId', label: 'Key ID' },
        { key: 'keySecret', label: 'Key Secret' },
    ],
};

const PROVIDERS = ['PAYU', 'RAZORPAY'];

const PROVIDER_LABELS: Record<string, string> = {
    PAYU: 'PayU',
    RAZORPAY: 'Razorpay',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProviderState {
    isActive: boolean;
    credentials: Record<string, string>;
    saving: boolean;
    activating: boolean;
    deleting: boolean;
    loaded: boolean;
    showFields: Record<string, boolean>;
}

const buildEmptyState = (provider: string): ProviderState => ({
    isActive: false,
    credentials: Object.fromEntries(PROVIDER_FIELDS[provider].map((f) => [f.key, ''])),
    saving: false,
    activating: false,
    deleting: false,
    loaded: false,
    showFields: Object.fromEntries(PROVIDER_FIELDS[provider].map((f) => [f.key, false])),
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPaymentGateway() {
    const [states, setStates] = useState<Record<string, ProviderState>>(
        Object.fromEntries(PROVIDERS.map((p) => [p, buildEmptyState(p)]))
    );
    const [loading, setLoading] = useState(true);

    // ── Fetch ──────────────────────────────────────────────────────────────────

    const fetchConfigs = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await getThirdPartyConfigsByCategory('PAYMENT_GATEWAY');
            if (!res?.isSuccess) return;

            const updates: Record<string, Partial<ProviderState>> = {};
            (res.data || []).forEach((cfg: any) => {
                const credMap: Record<string, string> = {};
                (cfg.credentials || []).forEach((c: any) => { credMap[c.key] = c.value; });
                updates[cfg.provider] = {
                    isActive: cfg.isActive,
                    credentials: {
                        ...Object.fromEntries(PROVIDER_FIELDS[cfg.provider]?.map((f) => [f.key, '']) ?? []),
                        ...credMap,
                    },
                    loaded: true,
                };
            });

            setStates((prev) => {
                const next = { ...prev };
                PROVIDERS.forEach((p) => {
                    if (updates[p]) next[p] = { ...next[p], ...updates[p], loaded: true };
                });
                return next;
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const setProp = (provider: string, patch: Partial<ProviderState>) =>
        setStates((prev) => ({ ...prev, [provider]: { ...prev[provider], ...patch } }));

    const handleCredChange = (provider: string, key: string, value: string) =>
        setStates((prev) => ({
            ...prev,
            [provider]: {
                ...prev[provider],
                credentials: { ...prev[provider].credentials, [key]: value },
            },
        }));

    const toggleFieldVisibility = (provider: string, key: string) =>
        setStates((prev) => ({
            ...prev,
            [provider]: {
                ...prev[provider],
                showFields: { ...prev[provider].showFields, [key]: !prev[provider].showFields[key] },
            },
        }));

    // ── Actions ────────────────────────────────────────────────────────────────

    const handleSave = async (provider: string) => {
        const state = states[provider];
        const credentials = Object.entries(state.credentials)
            .filter(([, v]) => v.trim() !== '')
            .map(([key, value]) => ({ key, value }));

        if (credentials.length === 0) return;

        setProp(provider, { saving: true });
        try {
            await upsertThirdPartyConfig(provider, credentials);
            await fetchConfigs();
        } finally {
            setProp(provider, { saving: false });
        }
    };

    const handleSetActive = async (provider: string) => {
        setProp(provider, { activating: true });
        try {
            await setActiveThirdPartyProvider(provider);
            await fetchConfigs();
        } finally {
            setProp(provider, { activating: false });
        }
    };

    const handleDelete = async (provider: string) => {
        setProp(provider, { deleting: true });
        try {
            await deleteThirdPartyConfig(provider);
            setStates((prev) => ({
                ...prev,
                [provider]: buildEmptyState(provider),
            }));
        } finally {
            setProp(provider, { deleting: false });
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Payment Gateways
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Configure and activate a payment gateway. Only one can be active at a time.
            </Typography>

            <Grid container spacing={3}>
                {PROVIDERS.map((provider) => {
                    const state = states[provider];
                    const fields = PROVIDER_FIELDS[provider];
                    const hasCredentials = Object.values(state.credentials).some((v) => v.trim() !== '');

                    return (
                        <Grid item xs={12} md={6} key={provider}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    borderColor: state.isActive ? 'rgba(89,50,234,0.7)' : 'divider',
                                    boxShadow: state.isActive ? '0 0 0 2px rgba(89,50,234,0.15)' : 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Typography variant="h6" fontWeight={700}>
                                                {PROVIDER_LABELS[provider]}
                                            </Typography>
                                            {state.isActive && (
                                                <Chip
                                                    icon={<CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} />}
                                                    label="Active"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(89,50,234,0.1)',
                                                        color: 'rgba(89,50,234,1)',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': { color: 'rgba(89,50,234,1)' },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        {state.loaded && (
                                            <Tooltip title={`Remove ${PROVIDER_LABELS[provider]} configuration`}>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    disabled={state.deleting}
                                                    onClick={() => handleDelete(provider)}
                                                >
                                                    {state.deleting ? <CircularProgress size={16} /> : <DeleteOutlineIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>

                                    <Divider sx={{ mb: 2.5 }} />

                                    {/* Credential Fields */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {fields.map((field) => (
                                            <TextField
                                                key={field.key}
                                                label={field.label}
                                                size="small"
                                                fullWidth
                                                type={state.showFields[field.key] ? 'text' : 'password'}
                                                value={state.credentials[field.key] ?? ''}
                                                onChange={(e) => handleCredChange(provider, field.key, e.target.value)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleFieldVisibility(provider, field.key)}
                                                                edge="end"
                                                            >
                                                                {state.showFields[field.key]
                                                                    ? <VisibilityOffOutlinedIcon fontSize="small" />
                                                                    : <VisibilityOutlinedIcon fontSize="small" />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    {/* Actions */}
                                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={state.saving ? <CircularProgress size={14} color="inherit" /> : <SaveOutlinedIcon />}
                                            disabled={state.saving || !hasCredentials}
                                            onClick={() => handleSave(provider)}
                                            sx={{
                                                bgcolor: 'rgba(89,50,234,1)',
                                                '&:hover': { bgcolor: 'rgba(69,30,214,1)' },
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {state.saving ? 'Saving…' : 'Save'}
                                        </Button>

                                        {!state.isActive && state.loaded && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={
                                                    state.activating
                                                        ? <CircularProgress size={14} />
                                                        : <RadioButtonUncheckedIcon />
                                                }
                                                disabled={state.activating}
                                                onClick={() => handleSetActive(provider)}
                                                sx={{
                                                    borderColor: 'rgba(89,50,234,0.5)',
                                                    color: 'rgba(89,50,234,1)',
                                                    '&:hover': { borderColor: 'rgba(89,50,234,1)', bgcolor: 'rgba(89,50,234,0.04)' },
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {state.activating ? 'Setting active…' : 'Set as Active'}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
