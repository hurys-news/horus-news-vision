// Hook لاستخدام API

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/lib/types';

interface UseApiOptions<T> {
  initialData?: T;
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// Hook عام لاستخدام API
export function useApi<T>(
  fetchFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { initialData, dependencies = [], onSuccess, onError } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchFunction();
        
        if (isMounted) {
          setData(result);
          setIsLoading(false);
          
          if (onSuccess) {
            onSuccess(result);
          }
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('حدث خطأ غير معروف');
          setError(error);
          setIsLoading(false);
          
          if (onError) {
            onError(error);
          }
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  
  return { data, isLoading, error, setData };
}

// Hook لاستخدام API مع التحميل المتعدد الصفحات
export function usePaginatedApi<T>(
  fetchFunction: (page: number, limit: number) => Promise<ApiResponse<T>>,
  options: UseApiOptions<ApiResponse<T>> & { limit?: number } = {}
) {
  const { limit = 10, dependencies = [], ...restOptions } = options;
  
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  const apiResult = useApi<ApiResponse<T>>(
    () => fetchFunction(page, limit),
    {
      ...restOptions,
      dependencies: [...dependencies, page, limit],
      onSuccess: (data) => {
        setHasMore(page < data.meta.totalPages);
        if (restOptions.onSuccess) {
          restOptions.onSuccess(data);
        }
      }
    }
  );
  
  const loadMore = () => {
    if (hasMore && !apiResult.isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  return {
    ...apiResult,
    page,
    setPage,
    hasMore,
    loadMore
  };
}
