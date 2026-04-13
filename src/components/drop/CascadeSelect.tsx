import React from 'react';
import { Chip, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface CascadeSelectProps {
  options: string[];
  value: string[];
  onChange: (memos: string[]) => void;
  disabled: boolean;
}

const CascadeSelect: React.FC<CascadeSelectProps> = ({
  options,
  value,
  onChange,
  disabled,
}) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    onChange(selected);
  };

  if (disabled) {
    return (
      <FormControl disabled size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Memos</InputLabel>
        <Select multiple value={[]} label="Memos">
          {options.map((option) => (
            <MenuItem key={option} value={option} dense>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Memos</InputLabel>
      <Select
        multiple
        value={value}
        label="Memos"
        onChange={handleChange}
        renderValue={(selected) => (
          <div className="flex flex-wrap gap-1">
            {(selected as string[]).map((memo) => (
              <Chip
                key={memo}
                label={memo}
                size="small"
                onDelete={() => onChange(value.filter(v => v !== memo))}
                sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#3B82F6',
                }}
              />
            ))}
          </div>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option} dense>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CascadeSelect;
