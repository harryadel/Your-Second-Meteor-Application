import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsList } from "/imports/api/methods/products";

import { Product } from "/imports/api/collections/products";
export const PRODUCTS_LIST_QUERY = "PRODUCTS_LIST_QUERY";

type useGetProductsProps = {
  options: any;
  filters: any[];
};

export function useGetProducts(methodInput: useGetProductsProps) {
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
