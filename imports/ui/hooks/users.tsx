import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cleanFilters, convertObjectToArray } from "./helpers";
import { Meteor } from "meteor/meteor";
import { listUsers } from "/imports/api/methods/users";

export const USERS_LIST_QUERY = "USERS_LIST_QUERY";

type useGetUsersProps = {
  options: any;
  filters: any[];
};

export function useGetUsers(methodInput: useGetUsersProps) {
  const { options, filters } = { ...methodInput };

  const query = useQuery<{ data: Meteor.User[]; total: number }>({
    queryKey: [USERS_LIST_QUERY, options, filters],
    queryFn: async () => {
      return listUsers({ options, filters });
    },
    placeholderData: keepPreviousData,
  });

  return query;
}

export const USER_DETAILS_QUERY = "USER_DETAILS_QUERY";
export function useGetUserDetails(userId: string | undefined) {
  return useQuery<Meteor.User>({
    queryKey: [USER_DETAILS_QUERY, userId],
    queryFn: async () => {
      return getUserDetails({ userId });
    },
    enabled: !!userId,
  });
}

export const USERS_WITHOUT_ASSETS_QUERY = "USERS_WITHOUT_ASSETS_QUERY";

type useGetUsersWithoutAssetsProps = {
  select?:
    | ((data: { data: Meteor.User[]; total: number }) => { data: Meteor.User[]; total: number })
    | undefined;
  skip: number;
  limit: number;
  sort: any;
  filters: any[];
};

export function useGetUsersWithoutAssets(methodInput: useGetUsersWithoutAssetsProps) {
  const { select, skip, limit, sort, filters } = { ...methodInput };
  return useQuery({
    queryKey: [USERS_WITHOUT_ASSETS_QUERY, skip, limit, sort, filters],
    queryFn: async () => {
      return getUsersWithoutAssets({
        skip,
        limit,
        sort,
        filters: convertObjectToArray(filters),
      });
    },
  });
}

export const USERS_WITHOUT_MATCHES_QUERY = "USERS_WITHOUT_MATCHES_QUERY";

type useGetUsersWithoutMatchesProps = {
  select?:
    | ((data: { data: Meteor.User[]; total: number }) => { data: Meteor.User[]; total: number })
    | undefined;
  skip: number;
  limit: number;
  sort: any;
  filters: any[];
};

export function useGetUsersWithoutMatches(methodInput: useGetUsersWithoutMatchesProps) {
  const { select, skip, limit, sort, filters } = { ...methodInput };
  return useQuery({
    queryKey: [USERS_WITHOUT_MATCHES_QUERY, skip, limit, sort, filters],
    queryFn: async () => {
      return getUsersWithoutMatches({
        skip,
        limit,
        sort,
        filters: convertObjectToArray(filters),
      });
    },
  });
}
