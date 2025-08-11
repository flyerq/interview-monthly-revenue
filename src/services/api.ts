import axios from 'axios';

const FINMIND_API_BASE_URL = 'https://api.finmindtrade.com/api/v4/data';

export const finmindApi = axios.create({
  baseURL: FINMIND_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0wOC0wNyAxODoyNDowMSIsInVzZXJfaWQiOiJmbHllciIsImlwIjoiMjEyLjg3LjE5NC42MyJ9.meFJWXc88-R3fDfVz5-015Lzkzll1P0gW1OsHYG3bGY',
  },
});

export interface StockInfo {
  stock_id: string;
  stock_name: string;
  industry_category?: string;
  type?: string;
  date?: string;
}
export interface StockMonthRevenue {
  country: string;
  date: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
  stock_id: string;
  growth_rate: number;
}

export interface DataResponse<T> {
  msg: string;
  status: number;
  data: T[];
}

export interface QueryParams {
  data_id?: string;
  start_date?: string;
  end_date?: string;
}

export const getStocks = async (params?: QueryParams): Promise<StockInfo[]> => {
  try {
    const response = await finmindApi.get<DataResponse<StockInfo>>('', {
      params: {dataset: 'TaiwanStockInfo', ...params},
    });

    if (response.data.msg === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.msg || '获取数据失败');
    }
  } catch (error) {
    console.error('获取TaiwanStockInfo失败:', error);
    throw error;
  }
};

export const getStock = async (params?: QueryParams): Promise<StockInfo> => {
  try {
    const response = await finmindApi.get<DataResponse<StockInfo>>('', {
      params: {dataset: 'TaiwanStockInfo', ...params},
    });

    if (response.data.msg === 'success') {
      return response.data.data?.[0];
    } else {
      throw new Error(response.data.msg || '获取数据失败');
    }
  } catch (error) {
    console.error('获取TaiwanStockInfo失败:', error);
    throw error;
  }
};

export const getStockMonthRevenue = async (params?: QueryParams): Promise<StockMonthRevenue[]> => {
  try {
    const response = await finmindApi.get<DataResponse<StockMonthRevenue>>('', {
      params: {dataset: 'TaiwanStockMonthRevenue', ...params},
    });

    if (response.data.msg === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.msg || '获取数据失败');
    }
  } catch (error) {
    console.error('获取TaiwanStockMonthRevenue失败:', error);
    throw error;
  }
};
