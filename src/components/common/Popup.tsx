'use client';

import React from 'react';
import './Popup.css';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Popup = ({
    header,
    inputs = [],
    buttons = [],
    onClose,
    handleInputChange,
    formValues,
    setFormValues,
    children
}: any) => {

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <Typography variant='h6' sx={{ fontWeight: 600, color: '#1a1a2e' }}>{header}</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', '&:hover': { backgroundColor: '#fee2e2', color: '#ef4444' } }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className="popup-divider" />
                <div className="popup-content">
                    {inputs.map((input: any, index: any) => (
                        <div key={index} className="popup-input">
                            {(input.type === "text" || input.type === "number" || input.type === "email") && <TextField
                                key={index}
                                required
                                label={input.label}
                                size="small"
                                sx={{ width: '100%' }}
                                onChange={(e) => handleInputChange(input.name, e.target.value)}
                                value={formValues[input.name]}
                                disabled={input.disabled || false}
                            />}
                            {
                                input.type === "select" && <Box sx={{ width: '100%' }} key={index}>
                                    <FormControl sx={{ width: '100%' }} size="small">
                                        <InputLabel id={`${input.name}${input.label}`}>{input.label}</InputLabel>
                                        <Select
                                            required
                                            id={`${input.name}${input.label}`}
                                            labelId={`${input.name}${input.label}`}
                                            value={formValues[input.name]}
                                            label={input.label}
                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        zIndex: 100,
                                                    },
                                                },
                                            }}
                                        >
                                            {input?.options &&
                                                input.options.map((cat: any) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                            {input?.menuItems && input.menuItems.map((item: any) => item)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            }
                            {
                                input.type === "text-area" && <TextField
                                    key={index}
                                    required
                                    label={input.label}
                                    multiline
                                    rows={3}
                                    size="small"
                                    sx={{ width: '100%' }}
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    value={formValues[input.name]}
                                />
                            }
                        </div>
                    ))}
                </div>
                {Array.isArray(children) && children?.length > 0 && children.map((x: any) => {
                    return x;
                })}
                {!Array.isArray(children) && children}
                {buttons.length > 0 && (
                    <>
                        <div className="popup-divider" />
                        <div className="popup-actions">
                            {buttons.map((button: any, index: any) => (
                                <Button
                                    key={button.label}
                                    className={button.className}
                                    onClick={() => button.onClick()}
                                    variant={button.variant || 'contained'}
                                    size="medium"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        px: 3,
                                        display: button.display,
                                        ...(button.variant === 'outlined' ? {
                                            color: '#64748b',
                                            borderColor: '#e2e8f0',
                                            '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
                                        } : {
                                            backgroundColor: '#5932EA',
                                            '&:hover': { backgroundColor: '#4a28d4' }
                                        })
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Popup;
