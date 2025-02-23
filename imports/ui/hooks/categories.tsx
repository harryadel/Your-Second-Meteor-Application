import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoriesList, categoriesSingle } from "/imports/api/methods/categories";
import { Category } from "/imports/api/collections/categories";

export const CATEGORIES_LIST_QUERY = "CATEGORIES_LIST_QUERY";
export const CATEGORY_QUERY = "CATEGORY_QUERY";

type useGetCategoriesProps = {
  options: {
    limit?: number;
    skip?: number;
    sort?: {
      field: string;
      direction: boolean;
    };
  };
  filters?: {
    title?: string;
    userId?: string;
  };
};

export function useGetCategories(methodInput: useGetCategoriesProps) {
  const { filters, options } = { ...methodInput };

  const query = useQuery<{ data: Category[]; total: number }>({
    queryKey: [CATEGORIES_LIST_QUERY, filters, options],
    queryFn: async () => {
      return categoriesList({ filters, options });
    },
    placeholderData: keepPreviousData,
  });

  return query;
}

export function useGetCategory(id?: string) {
  const query = useQuery<Category | null>({
    queryKey: [CATEGORY_QUERY, id],
    queryFn: async () => {
      if (!id) return null;
      return categoriesSingle({ id });
    },
    enabled: !!id,
  });

  return query;
}
