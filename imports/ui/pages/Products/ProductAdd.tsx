import React from "react";
import { Header, PageContainer } from "@components";
import { Anchor, Button, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCTS_LIST_QUERY } from "@hooks";
import { PAPER_PROPS } from "../../constants/styles";
import { productsAdd } from "/imports/api/methods/products";
import { z } from "zod";

const ProductAdd = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: "",
      type: "",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: { name: string; type: string }) => {
    await productsAdd(values);
    queryClient.invalidateQueries({ queryKey: [PRODUCTS_LIST_QUERY] });
    navigate(-1);
  };

  const breadcrumbs = [
    { title: "Products", href: "/dashboard/products" },
    { title: "Add Product", href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

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
          <Header title="Add Product" breadcrumbs={breadcrumbs}></Header>

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
                withAsterisk
                {...form.getInputProps("name")}
              />
              <TextInput
                name="type"
                placeholder="Product Type"
                label="Product Type"
                description="This represents the type of the product"
                withAsterisk
                {...form.getInputProps("type")}
              />
            </Stack>
          </Paper>
        </Stack>
      </PageContainer>
    </form>
  );
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
});

export default ProductAdd;
