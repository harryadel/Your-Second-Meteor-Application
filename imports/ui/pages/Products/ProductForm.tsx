import React, { useEffect } from "react";
import { Header, PageContainer } from "@components";
import { Anchor, Button, Paper, Stack, Text, TextInput, MultiSelect, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCTS_LIST_QUERY, useProduct } from "@hooks";
import { PAPER_PROPS } from "../../constants/styles";
import { productsAdd, productsUpdate } from "/imports/api/methods/products";
import { useGetCategories } from "/imports/ui/hooks/categories";
import { ProductType } from "/imports/api/types/products";
import { useTranslation } from "react-i18next";
import "/imports/i18n/config";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: product, isLoading } = useProduct(id);
  const isEditing = Boolean(id);
  const { data: categories = [] } = useGetCategories();
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      type: ProductType.Physical,
      categoryIds: [] as string[],
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      type: (value) => (!value ? "Type is required" : null),
    },
  });

  useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name,
        type: product.type,
        categoryIds: product.categoryIds,
      });
    }
  }, [product]);

  const handleSubmit = async (values: { name: string; type: ProductType; categoryIds: string[] }) => {
    if (isEditing) {
      await productsUpdate({ id, ...values });
    } else {
      await productsAdd(values);
    }
    queryClient.invalidateQueries({ queryKey: [PRODUCTS_LIST_QUERY] });
    navigate(-1);
  };

  const breadcrumbs = [
    { title: "Products", href: "/dashboard/products" },
    { title: isEditing ? "Edit Product" : "Add Product", href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));

  const typeOptions = Object.entries(ProductType).map(([_, value]) => ({
    value,
    label: t(`type.${value}`),
  }));

  if (isEditing && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <PageContainer
        bottom={
          <>
            <Button disabled={form.submitting} variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={form.submitting} disabled={form.submitting}>
              Save
            </Button>
          </>
        }
      >
        <Stack>
          <Header title={isEditing ? "Edit Product" : "Add Product"} breadcrumbs={breadcrumbs}></Header>

          <Paper {...PAPER_PROPS}>
            <Text size="lg" fw={600} mb="md">
              General Information
            </Text>
            <Stack>
              <TextInput
                name="name"
                placeholder="Product Name"
                label="Product Name"
                description="This represents the name of the product"
                withAsterisk={true}
                {...form.getInputProps("name")}
              />
              <Select
                name="type"
                data={typeOptions}
                label="Product Type"
                description="Choose whether this is a physical or digital product"
                withAsterisk={true}
                {...form.getInputProps("type")}
              />
              <MultiSelect
                name="categoryIds"
                data={categoryOptions}
                label="Categories"
                placeholder="Select categories"
                description="Select one or more categories for this product"
                searchable
                {...form.getInputProps("categoryIds")}
              />
            </Stack>
          </Paper>
        </Stack>
      </PageContainer>
    </form>
  );
};

export default ProductForm;
