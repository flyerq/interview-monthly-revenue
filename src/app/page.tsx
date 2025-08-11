'use client';
import React, {useState} from 'react';
import {Container, AppBar, Stack} from '@mui/material';
import StockSearchBox from '@/components/StockSearchBox';
import OverviewCard from '@/components/OverviewCard';
import RevenueTable from '@/components/RevenueTable';
import RevenueChart from '@/components/RevenueChart';
import {StockInfo} from '@/services/api';

const defaultStock: StockInfo = {
  stock_id: '2867',
  stock_name: '三商壽',
};

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<StockInfo>(defaultStock);

  const handleSearch = (stock: StockInfo) => {
    setSelectedStock(stock);
  };

  return (
    <>
      <AppBar position="static" elevation={0} sx={{p: 2, bgcolor: 'background.paper', alignItems: 'center'}}>
        <StockSearchBox onSearch={handleSearch} />
      </AppBar>

      <Container maxWidth="md" sx={{py: 3}}>
        <Stack spacing={2}>
          <OverviewCard stock={selectedStock} />
          <RevenueChart stock={selectedStock} />
          <RevenueTable stock={selectedStock} />
        </Stack>
      </Container>
    </>
  );
}
