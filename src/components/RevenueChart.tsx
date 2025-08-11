'use client';
import React, {useMemo} from 'react';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Card, CardContent, Box, Button, Stack, CircularProgress} from '@mui/material';
import {StockInfo} from '@/services/api';
import {useStockMonthRevenue} from '@/hooks/useStockData';

interface MonthlyRevenueChartProps {
  stock?: StockInfo;
}

export default function MonthlyRevenueChart({stock}: MonthlyRevenueChartProps) {
  const {data: monthRevenueData, isLoading} = useStockMonthRevenue({
    data_id: stock?.stock_id,
    start_date: dayjs().subtract(5, 'year').startOf('month').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
  });

  const revenues = useMemo(
    () =>
      monthRevenueData?.map(item => [
        new Date(item.revenue_year, item.revenue_month - 1, 1).getTime(),
        item.revenue / 1000,
      ]),
    [monthRevenueData]
  );
  const growthRates = useMemo(
    () =>
      monthRevenueData?.map(item => [
        new Date(item.revenue_year, item.revenue_month - 1, 1).getTime(),
        item.growth_rate,
      ]),
    [monthRevenueData]
  );

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: '#ffffff',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        year: '%Y',
      },
      labels: {
        style: {
          fontSize: '0.8em',
          color: '#666666',
        },
      },
      tickInterval: 365 * 24 * 3600 * 1000,
      tickWidth: 0,
      lineWidth: 0,
      // lineColor: '#eebdc3',
      gridLineWidth: 1,
      gridLineColor: '#f0f0f0',
    },
    yAxis: [
      {
        title: {
          text: '',
        },
        labels: {
          style: {
            color: '#333333',
            fontSize: '0.8em',
          },
          formatter: function () {
            if (this.isLast) return '<strong>千元</strong>';
            return Highcharts.numberFormat(this.value as number, 0);
          },
        },
        gridLineColor: '#f0f0f0',
        plotBands: [
          {
            from: -Infinity,
            to: 0,
            color: '#fefafb',
          },
        ],
        plotLines: [
          {
            value: 0,
            color: '#eebdc3',
            width: 2,
            zIndex: 5,
          },
        ],
      },
      {
        title: {
          text: '',
        },
        labels: {
          style: {
            color: '#333333',
            fontSize: '0.8em',
          },
          formatter: function () {
            if (this.isLast) return '<strong>%</strong>';
            return Highcharts.numberFormat(this.value as number, 0);
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 8,
      style: {
        color: '#fff',
        fontSize: '0.8em',
      },
      formatter: function () {
        const points = this.points || [];
        let tooltip = `<b>${dayjs(this.x).format('YYYY/MM')}</b><br/>`;

        points.forEach(point => {
          if (point.series.name === '每月營收') {
            tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${Highcharts.numberFormat(
              point.y as number,
              0,
              ',',
              ','
            )} 千元</b><br/>`;
          } else {
            tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${Highcharts.numberFormat(
              point.y as number,
              2
            )}</b><br/>`;
          }
        });

        return tooltip;
      },
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      floating: true,
      x: 80,
      y: 10,
      itemStyle: {
        fontSize: '0.8em',
        fontWeight: 'normal',
        color: '#333333',
      },
      symbolHeight: 12,
      symbolWidth: 16,
      symbolRadius: 2,
    },
    plotOptions: {
      column: {
        borderWidth: 1,
        borderColor: 'rgb(232, 175, 0)',
        borderRadius: 0,
        groupPadding: 0.1,
        pointPadding: 0.05,
      },
      line: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3,
          },
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4,
            },
          },
        },
      },
    },
    series: [
      {
        name: '每月營收',
        type: 'column',
        data: revenues || [],
        color: 'rgba(232, 175, 0, 0.4)',
        yAxis: 0,
        tooltip: {
          valueSuffix: ' 千元',
        },
      },
      {
        name: '單月營收年增率 (%)',
        type: 'line',
        data: growthRates || [],
        color: 'rgb(203, 75, 75)',
        yAxis: 1,
        tooltip: {
          valueSuffix: '%',
        },
        lineWidth: 2,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 3,
          states: {
            hover: {
              enabled: true,
              radius: 5,
            },
          },
        },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <Card elevation={0} sx={{pb: 2}}>
      <CardContent>
        <Stack direction="row" sx={{mb: 3, justifyContent: 'space-between', alignItems: 'center'}}>
          <Button variant="contained">每月營收</Button>
          <Button variant="contained">近 5 年</Button>
        </Stack>

        <Box sx={{width: '100%', overflow: 'hidden'}}>
          {isLoading && (
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <CircularProgress />
            </Box>
          )}
          {!isLoading && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
        </Box>
      </CardContent>
    </Card>
  );
}
