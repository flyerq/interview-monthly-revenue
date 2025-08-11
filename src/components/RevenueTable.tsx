'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import {StockInfo} from '@/services/api';
import {useStockMonthRevenue} from '@/hooks/useStockData';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';

interface RevenueTableProps {
  stock?: StockInfo;
}

export default function RevenueTable({stock}: RevenueTableProps) {
  const {data: MonthRevenueData, isLoading} = useStockMonthRevenue({
    data_id: stock?.stock_id,
    start_date: dayjs().subtract(5, 'year').startOf('month').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
  });

  if (isLoading) return null;

  return (
    <Box>
      <Card elevation={0}>
        <CardContent>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
            <Button variant="contained">詳細數據</Button>
          </Box>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{bgcolor: '#f9f9f9'}}>
                  <TableCell sx={{border: '1px solid #ddd', py: 2, minWidth: 180}}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{fontWeight: 'bold'}}>
                      年度/月份
                    </Typography>
                  </TableCell>
                  {MonthRevenueData?.map(item => (
                    <TableCell key={item.date} align="center" sx={{border: '1px solid #ddd', py: 2}}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.revenue_year}/{item.revenue_month.toString().padStart(2, '0')}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{border: '1px solid #ddd', py: 2, bgcolor: '#ffffff'}}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      每月營收
                    </Typography>
                  </TableCell>
                  {MonthRevenueData?.map(item => (
                    <TableCell key={`revenue-${item.date}`} align="center" sx={{border: '1px solid #ddd', py: 2}}>
                      <Typography variant="body2">
                        {Highcharts.numberFormat(item.revenue / 1000, 0, ',', ',')}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow>
                  <TableCell sx={{border: '1px solid #ddd', py: 2, bgcolor: '#f9f9f9'}}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      單月營收年增率 (%)
                    </Typography>
                  </TableCell>
                  {MonthRevenueData?.map(item => (
                    <TableCell key={`growth-${item.date}`} align="center" sx={{border: '1px solid #ddd', py: 2}}>
                      <Typography variant="body2">{Highcharts.numberFormat(item.growth_rate, 2)}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{mt: 2, textAlign: 'right'}}>
        <Typography variant="caption">
          圖表單位：千元，數據來自公開資訊觀測站
          <br />
          網頁圖表歡迎轉貼引用，請註明出處為財報狗
        </Typography>
      </Box>
    </Box>
  );
}
