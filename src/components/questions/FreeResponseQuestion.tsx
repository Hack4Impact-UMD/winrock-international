import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FreeResponseQuestionProps {
    questionName: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    rows?: number;
}

function FreeResponseQuestion({
    questionName,
    value,
    onChange,
    multiline = false,
    rows = 1,
}: FreeResponseQuestionProps) {
    return (
        <TextField
            fullWidth
            label={questionName}
            value={value}
            onChange={(e: { target: { value: string } }) => onChange(e.target.value)}
            multiline={multiline}
            rows={rows}
            sx={{ mb: 2 }}
        />
    );
}

export default FreeResponseQuestion; 