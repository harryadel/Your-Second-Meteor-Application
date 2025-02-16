import React from "react";
import { DataTable, DataTableColumn, DataTableProps, DataTableSortStatus } from "mantine-datatable";
import { Group, Text, Card } from "@mantine/core";

import { CARD_PROPS } from "./Styles";
import { JsonParam, NumberParam, StringParam, useQueryParams, withDefault } from "use-query-params";
import { PAGE_SIZES } from "/imports/constants/settings";

type CustomDataTableProps<T> = DataTableProps<T> & {
  columns: DataTableColumn<T>[];
  title?: string;
  useGetPaginatedHook: Function;
  filterProps?: Object;
  filterComponents?: React.ReactNode;
  sortProps?: { columnAccessor: string; direction: string };
};

const CustomDataTable = <T,>({
  title,
  useGetPaginatedHook,
  filterComponents,
  sortProps,
  ...props
}: CustomDataTableProps<T>) => {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    pageSize: withDefault(NumberParam, PAGE_SIZES[4]),
    filters: withDefault(JsonParam, {}),
    columnAccessor: withDefault(StringParam, sortProps?.columnAccessor ?? "_id"),
    direction: withDefault(StringParam, sortProps?.direction ?? "asc"),
  });

  const { page, pageSize, filters, columnAccessor, direction } = query;

  const sortStatus: DataTableSortStatus = {
    columnAccessor,
    direction,
  };

  const setPage = (page: number) => {
    setQuery({ page }, "pushIn");
  };

  const setPageSize = (pageSize: number) => {
    setQuery({ pageSize, page: 1 }, "pushIn");
  };

  const setSortStatus = (sortStatus: DataTableSortStatus) => {
    setQuery(
      { columnAccessor: sortStatus.columnAccessor, direction: sortStatus.direction },
      "pushIn"
    );
  };

  const { data, isLoading } = useGetPaginatedHook({
    options: {
      skip: pageSize * (page - 1),
      limit: pageSize,
      sort: {
        field: sortStatus.columnAccessor ?? null,
        direction: sortStatus.direction === "desc",
      },
    },
    filters,
  });

  const records = data?.data ?? [];
  const rowCount = data?.total ?? 0;

  return (
    <>
      {!!filterComponents && (
        <Card {...CARD_PROPS} mb="sm">
          <Text fz="28px" fw={600} mb="sm">
            Filters
          </Text>
          {filterComponents}
        </Card>
      )}

      <Card {...CARD_PROPS}>
        <Group justify="space-between" mb="md">
          {title && (
            <Text fz="lg" fw={600}>
              {title}
            </Text>
          )}
        </Group>
        <DataTable
          backgroundColor={{
            dark: "var(--mantine-color-disabledGrey-6)",
            light: "var(--mantine-color-disabledGrey-6)",
          }}
          fetching={isLoading}
          minHeight={200}
          verticalSpacing="xs"
          borderRadius={"0.25rem"}
          highlightOnHover={true}
          records={records}
          totalRecords={rowCount}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={p => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          idAccessor="_id"
          {...props}
        />
      </Card>
    </>
  );
};

export default CustomDataTable;
