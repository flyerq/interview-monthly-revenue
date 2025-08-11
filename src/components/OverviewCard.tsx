'use client';
import React from 'react';
import {Box, Card, CircularProgress, Typography} from '@mui/material';
import {StockInfo} from '@/services/api';
import {useStock} from '@/hooks/useStockData';

export default function OverviewCard({stock}: {stock?: StockInfo}) {
  const {data: stockData, isLoading} = useStock({data_id: stock?.stock_id});

  return (
    <Card elevation={0}>
      <Box sx={{p: 2}}>
        {isLoading && (
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && stockData && (
          <Typography variant="h6">
            {stockData.stock_name} ({stockData.stock_id})
          </Typography>
        )}
      </Box>
    </Card>
  );
}
