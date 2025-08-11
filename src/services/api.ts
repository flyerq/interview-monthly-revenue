import axios from 'axios';

const API_BASE_URL = '/api/finmind';

export const finmindApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
