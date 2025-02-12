import React, { useMemo } from "react";
import { CARD_PROPS, CustomDataTable, FilterSearch, Header } from "@components";
import { Box, Button, Card, Group } from "@mantine/core";
import { IconColumns, IconFilter, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router";

import { formatDistanceToNow } from "date-fns";
import { useGetProducts } from "@hooks";
import { DataTableColumn } from "mantine-datatable";
import { productsDelete } from "/imports/api/methods/products";
import { Product } from "/imports/api/collections/products";

const ProductList = () => {
  const navigate = useNavigate();
  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        accessor: "name",
        title: "Name",
        sortable: true,
      },
      {
        accessor: "type",
        title: "Type",
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
            <Button variant="outline" onClick={() => productsDelete({ _id: row._id! })}>
              Delete
            </Button>
          </Group>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Header
        title="Products"
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
            <FilterSearch searchFields={["name", "type"]} label="Search" />
          </Box>
          <Button variant="light" leftSection={<IconColumns size="1rem" />}>
            Columns
          </Button>
          <Button variant="light" leftSection={<IconFilter size="1rem" />}>
            Filters
          </Button>
        </Group>
      </Card>
      <CustomDataTable<Product>
        columns={columns}
        useGetPaginatedHook={useGetProducts}
        onRowClick={({ record }) => {
          console.log("Navigate to details", record._id);
        }}
      ></CustomDataTable>
    </>
  );
};

export default ProductList;
