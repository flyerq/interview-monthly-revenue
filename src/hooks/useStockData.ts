import dayjs from 'dayjs';
import uniqBy from 'lodash/uniqBy';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {getStocks, getStockMonthRevenue, QueryParams, StockInfo, getStock} from '@/services/api';

type QueryOptions<TData> = Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>;

// 查询键常量
export const STOCK_QUERY_KEYS = {
  stocks: () => ['stocks'] as const,
  stock: (params?: QueryParams) => ['stock', params] as const,
  stockMonthRevenue: (params?: QueryParams) => ['stockMonthRevenue', params] as const,
};

// 获取所有股票数据
export const useStocks = (params?: QueryParams, options?: QueryOptions<Awaited<ReturnType<typeof getStocks>>>) => {
  return useQuery({
    // API 不支持data_id模糊查询，需要前端手动过滤，所以这里不传params
    queryKey: STOCK_QUERY_KEYS.stocks(),
    queryFn: () => getStocks(),
    select: data => {
      // 如果数据为空或data_id为空，则返回原始数据前十条
      if (!data || !params?.data_id) {
        return (data as StockInfo[])?.slice(0, 10) || [];
      }

      // 如果data_id和数据都不为空，过滤出包含data_id的数据的前10条
      return uniqBy(
        filter(
          data as StockInfo[],
          item => item.stock_id.includes(params.data_id || '') || item.stock_name.includes(params.data_id || '')
        ),
        'stock_id'
      )?.slice(0, 10);
    },
    ...options,
  });
};

// 获取单个股票数据
export const useStock = (params?: QueryParams, options?: QueryOptions<Awaited<ReturnType<typeof getStock>>>) => {
  return useQuery({
    queryKey: STOCK_QUERY_KEYS.stock(params),
    queryFn: () => getStock(params),
    ...options,
  });
};

// 获取股票月营收表数据
export const useStockMonthRevenue = (
  params?: QueryParams,
  options?: QueryOptions<Awaited<ReturnType<typeof getStockMonthRevenue>>>
) => {
  return useQuery({
    queryKey: STOCK_QUERY_KEYS.stockMonthRevenue(params),
    queryFn: async () => {
      // 获取前一年的开始日期，用于计算年增率
      const startDate = dayjs(params?.start_date).subtract(1, 'year').startOf('month').format('YYYY-MM-DD');

      // 获取包含前一年数据的完整数据
      const data = await getStockMonthRevenue({...params, start_date: startDate});

      if (!data || data.length === 0) {
        return [];
      }

      // 按日期分组数据
      const dateGroupedData = groupBy(data, 'date');

      // 根据实际查询的月份数，获取实际查询的月份段数据
      const queryMonthsCount = Math.abs(dayjs(params?.end_date).diff(params?.start_date, 'month'));
      const queryMonthsData = data.slice(-queryMonthsCount);

      // 计算年增率
      const result = queryMonthsData.map(item => {
        const lastYearSameMonth = dayjs(item.date).subtract(1, 'year').startOf('month').format('YYYY-MM-DD');
        const lastYearSameMonthData = dateGroupedData[lastYearSameMonth]?.[0];
        const growthRate =
          lastYearSameMonthData?.revenue > 0 ? (item.revenue / lastYearSameMonthData.revenue - 1) * 100 : 0;

        return {
          ...item,
          growth_rate: growthRate,
        };
      });

      return result;
    },
    ...options,
  });
};
