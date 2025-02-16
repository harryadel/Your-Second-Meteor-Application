import React from "react";
import { Header, PageContainer } from "@components";
import { Anchor, Button, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCTS_LIST_QUERY, useProduct } from "@hooks";
import { PAPER_PROPS } from "../../constants/styles";
import { productsAdd, productsUpdate } from "/imports/api/methods/products";
import { z } from "zod";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: product, isLoading } = useProduct(id);
  const isEditing = Boolean(id);

  const form = useForm({
    initialValues: {
      name: "",
      type: "",
    },
    validate: zodResolver(schema),
  });

  React.useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name,
        type: product.type,
      });
    }
  }, [product]);

  const handleSubmit = async (values: { name: string; type: string }) => {
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
              <TextInput
                name="type"
                placeholder="Product Type"
                label="Product Type"
                description="This represents the type of the product"
                withAsterisk={true}
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

export default ProductForm;
