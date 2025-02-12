import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { convertObjectToArray } from "./helpers";

import { getNotificationTemplates } from "../api/notificationTemplates";
import { NotificationTemplate } from "/imports/api/notificationTemplates/notificationTemplates.types";
export const NOTIFICATION_TEMPLATES_LIST_QUERY = "NOTIFICATION_TEMPLATES_LIST_QUERY";

type useGetNotificationTemplatesProps = {
  skip?: number;
  limit?: number;
  sort?: any;
  filters?: any[];
};

export function useGetNotificationTemplates(methodInput: useGetNotificationTemplatesProps) {
  const { skip, limit, sort, filters } = { ...methodInput };

  const query = useQuery<{ data: NotificationTemplate[]; total: number }>({
    queryKey: [NOTIFICATION_TEMPLATES_LIST_QUERY, skip, limit, sort, filters],
    queryFn: async () => {
      return getNotificationTemplates({
        skip,
        limit,
        sort,
        filters: convertObjectToArray(filters),
      });
    },
    placeholderData: keepPreviousData,
  });

  return query;
}
