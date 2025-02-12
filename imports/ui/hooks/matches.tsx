import { Match } from "@api/matches/matches.types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMatches } from "../api/matches";
import { cleanFilters, convertObjectToArray } from "./helpers";

export const MATCHES_LIST_QUERY = "MATCHES_LIST_QUERY";

type useGetMatchesProps = {
  select?:
    | ((data: { data: Match[]; total: number }) => { data: Match[]; total: number })
    | undefined;
  skip: number;
  limit: number;
  sort: any;
  filters: any[];
};

export function useGetMatches(methodInput: useGetMatchesProps) {
  const { select, skip, limit, sort, filters } = { ...methodInput };
  cleanFilters(filters);

  const query = useQuery<{ data: Match[]; total: number }>({
    queryKey: [MATCHES_LIST_QUERY, skip, limit, sort, filters],
    queryFn: async () => {
      return getMatches({ skip, limit, sort, filters: convertObjectToArray(filters) });
    },
    select: select,
    placeholderData: keepPreviousData,
  });

  return query;
}
