import { useQuery } from "@tanstack/react-query";
import { categoriesList } from "/imports/api/methods/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories-select"],
    queryFn: async () => {
      const result = await categoriesList({
        options: {},
        filters: {}
      });
      return result.data;
    },
  });
}
