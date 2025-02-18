import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsList, productsSingle } from "/imports/api/methods/products";

import { Product } from "/imports/api/collections/products";
import { useState, useEffect } from "react";

export const PRODUCTS_LIST_QUERY = "PRODUCTS_LIST_QUERY";
export const PRODUCT_QUERY = "product";

type useGetProductsProps = {
  options: any;
  filters: any[];
};

export function useGetProducts(methodInput: useGetProductsProps) {
  console.log("METHOD INPUT: ", methodInput)
  const { filters, options } = { ...methodInput };

  const query = useQuery<{ data: Product[]; total: number }>({
    queryKey: [PRODUCTS_LIST_QUERY, filters, options],
    queryFn: async () => {
      return productsList({ filters, options });
    },
    placeholderData: keepPreviousData,
  });

  return query;
}

export const useProduct = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    productsSingle({ id })
      .then((result) => {
        setProduct(result);
      })
      .catch((err) => {
        setError(err);
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { data: product, isLoading, error };
};
