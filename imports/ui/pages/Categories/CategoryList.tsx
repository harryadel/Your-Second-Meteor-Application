import React, { useMemo } from "react";
import { CARD_PROPS, CustomDataTable, FilterSearch, Header } from "@components";
import { Box, Button, Card, Group } from "@mantine/core";
import { IconColumns, IconFilter, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { useGetCategories, CATEGORIES_LIST_QUERY } from "/imports/ui/hooks/categories";
import { DataTableColumn } from "mantine-datatable";
import { categoriesDelete } from "/imports/api/methods/categories";
import { Category } from "/imports/api/collections/categories";
import logger from "../../../utils/logger";
import { useQueryClient } from "@tanstack/react-query";

const CategoryList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async (_id: string) => {
    await categoriesDelete({ _id });
    queryClient.invalidateQueries({ queryKey: [CATEGORIES_LIST_QUERY] });
  };

  const columns: DataTableColumn<Category>[] = useMemo(
    () => [
      {
        accessor: "title",
        title: "Title",
        sortable: true,
      },
      {
        accessor: "createdAt",
        title: "Date",
        sortable: true,
        render: row => formatDistanceToNow(new Date(row.createdAt ?? new Date())),
      },
      {
        accessor: "user",
        title: "User",
        render: row => row.user?.emails[0]?.address,
      },
      {
        accessor: "actions",
        title: "Actions",
        render: row => (
          <Group>
            <Button variant="outline" onClick={() => navigate(`/dashboard/categories/${row._id}/edit`)}>
              Edit
            </Button>
            <Button variant="outline" color="red" onClick={() => handleDelete(row._id!)}>
              Delete
            </Button>
          </Group>
        ),
      },
    ],
    [navigate]
  );

  return (
    <>
      <Header
        title="Categories"
        rightElement={
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => {
              navigate("add");
            }}
          >
            Add
          </Button>
        }
      ></Header>
      <Card {...CARD_PROPS} mb="md">
        <Group align="flex-end">
          <Box flex={1}>
            <FilterSearch searchFields={["title"]} label="Search" />
          </Box>
          <Button variant="light" leftSection={<IconColumns size="1rem" />}>
            Columns
          </Button>
          <Button variant="light" leftSection={<IconFilter size="1rem" />}>
            Filters
          </Button>
        </Group>
      </Card>
      <CustomDataTable<Category>
        columns={columns}
        useGetPaginatedHook={useGetCategories}
        onRowClick={({ record }) => {
          logger.debug("Navigating to category details", { categoryId: record._id });
        }}
      ></CustomDataTable>
    </>
  );
};

export default CategoryList;
