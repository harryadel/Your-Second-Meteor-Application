import React, { useMemo } from "react";
import { CARD_PROPS, CustomDataTable, FilterSearch, Header, FilterDate, FilterMultiSelect } from "@components";
import { Box, Button, Card, Group, Stack, Drawer } from "@mantine/core";
import { IconColumns, IconFilter, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { useGetProducts, PRODUCTS_LIST_QUERY } from "@hooks";
import { DataTableColumn } from "mantine-datatable";
import { productsDelete } from "/imports/api/methods/products";
import { Product } from "/imports/api/collections/products";
import logger from "../../../utils/logger";
import { useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { ProductType } from "/imports/api/types/products";
import { useCategories } from "/imports/ui/hooks/useCategories";
import { useGetUsers } from "/imports/ui/hooks/users";
import { useTranslation } from "react-i18next";
import "/imports/i18n/config";

const ProductList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: categories = [] } = useCategories();
  const { data: usersData } = useGetUsers({
    options: { skip: 0, limit: 100, sort: { field: "createdAt", direction: true } },
    filters: []
  });
  const { t } = useTranslation();

  const categoryOptions = useMemo(() => 
    categories.map(category => ({
      value: category._id,
      label: category.title
    })), [categories]);

  const userOptions = useMemo(() => 
    usersData?.data?.map(user => ({
      value: user._id,
      label: user.emails?.[0]?.address || 'No email'
    })) || [], [usersData]);

  const typeOptions = useMemo(() => 
    Object.values(ProductType).map(value => ({
      value,
      label: t(`type.${value}`)
    })), [t]);

  const handleDelete = async (_id: string) => {
    await productsDelete({ _id });
    queryClient.invalidateQueries({ queryKey: [PRODUCTS_LIST_QUERY] });
  };

  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        accessor: "name",
        title: "Name",
        sortable: true,
      },
      {
        accessor: "type",
        title: t("Type"),
        sortable: true,
        render: row => t(`type.${row.type}`)
      },
      {
        accessor: "categories",
        title: "Categories",
        sortable: true,
        render: row => row.categories?.map((category: any) => category.title).join(", "),
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
            <Button variant="outline" onClick={() => navigate(`/dashboard/products/${row._id}/edit`)}>
              Edit
            </Button>
            <Button variant="outline" color="red" onClick={() => handleDelete(row._id!)}>
              Delete
            </Button>
          </Group>
        ),
      },
    ],
    [navigate, t]
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
          <Button variant="light" leftSection={<IconFilter size="1rem" />} onClick={open}>
            Filters
          </Button>
        </Group>
      </Card>
      <Drawer
        opened={opened}
        onClose={close}
        title="Filter Products"
        position="right"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Stack>
          <FilterSearch label="Name" searchFields={["name"]} />
          <FilterMultiSelect
            label="Type"
            name="type"
            data={typeOptions}
          />
          <FilterMultiSelect
            label="Category"
            name="categoryIds"
            data={categoryOptions}
          />
          <FilterMultiSelect
            label="Created By"
            name="userId"
            data={userOptions}
          />
          <FilterDate label="Created On" name="createdAt" />
        </Stack>
      </Drawer>
      <CustomDataTable<Product>
        columns={columns}
        useGetPaginatedHook={useGetProducts}
        onRowClick={({ record }) => {
          logger.debug("Navigating to product details", { productId: record._id });
        }}
      ></CustomDataTable>
    </>
  );
};

export default ProductList;
