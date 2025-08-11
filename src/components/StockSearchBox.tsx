'use client';
import React, {useState} from 'react';
import {Box, Autocomplete, TextField, CircularProgress, Typography} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
import {useDebounce} from '@uidotdev/usehooks';
import {useStocks} from '@/hooks/useStockData';
import type {StockInfo} from '@/services/api';

export interface StockSearchBoxProps {
  onSearch?: (stock: StockInfo) => void;
}

export default function StockSearchBox({onSearch}: StockSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null);
  const {data: stocks, isLoading} = useStocks({data_id: debouncedSearchTerm}, {enabled: !!debouncedSearchTerm});

  const handleStockSelect = (stock: StockInfo | null) => {
    setSelectedStock(stock);
    if (stock) {
      setSearchTerm(stock.stock_id);
      onSearch?.(stock);
    }
  };

  const handleInputChange = (e: React.SyntheticEvent, value: string) => {
    setSearchTerm(value);
    if (!value) {
      setSelectedStock(null);
    }
  };

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
      <Autocomplete
        sx={{width: '400px'}}
        size="small"
        freeSolo
        disableClearable
        options={(stocks as StockInfo[]) || []}
        filterOptions={v => v}
        noOptionsText="沒有找到股票"
        getOptionLabel={option => (typeof option === 'string' ? option : option.stock_name)}
        isOptionEqualToValue={(option, value) => {
          if (typeof option === 'string' || typeof value === 'string') return option === value;
          return option.stock_id === value.stock_id;
        }}
        getOptionKey={option => (typeof option === 'string' ? option : option.stock_id)}
        loading={isLoading}
        loadingText="正在搜索股票..."
        value={selectedStock ?? undefined}
        onChange={(e, value) => handleStockSelect(typeof value === 'string' ? null : (value as StockInfo | null))}
        onInputChange={handleInputChange}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Typography variant="body2" fontWeight="medium" color="text.secondary">
              {option.stock_id} {option.stock_name}
            </Typography>
          </Box>
        )}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="輸入台／美股代號，查看公司價值"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {isLoading ? <CircularProgress color="inherit" size={24} /> : <SearchIcon />}
                  </>
                ),
              },
            }}
          />
        )}
      />
    </Box>
  );
}
