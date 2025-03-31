import React from 'react';
import { TextField } from '@mui/material';
import { Box, Typography } from '@mui/material';

interface FreeResponseQuestionProps {
    questionName: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
}

function FreeResponseQuestion({
    questionName,
    value,
    onChange,
    multiline = false,
    rows = 1,
    placeholder
}: FreeResponseQuestionProps) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                {questionName}
            </Typography>
            <TextField
                fullWidth
                value={value}
                onChange={(e) => onChange(e.target.value)}
                multiline={multiline}
                rows={rows}
                placeholder={placeholder}
            />
        </Box>
    );
}

export default FreeResponseQuestion; 