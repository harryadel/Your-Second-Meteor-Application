import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Group, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { categoriesAdd, categoriesUpdate, categoriesSingle } from "/imports/api/methods/categories";
import { useQuery } from "@tanstack/react-query";

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
    },
  });

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      if (!id) return null;
      return categoriesSingle({ id });
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (category) {
      form.setValues({
        title: category.title,
      });
    }
  }, [category]);

  const onSubmit = async (values: { title: string }) => {
    try {
      if (id) {
        await categoriesUpdate({
          id,
          ...values,
        });
      } else {
        await categoriesAdd(values);
      }
      navigate("/dashboard/categories");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <Card withBorder>
      <Title order={2} mb="md">{id ? "Edit Category" : "Add Category"}</Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Title"
          placeholder="Enter category title"
          required
          {...form.getInputProps("title")}
          mb="md"
        />

        <Group justify="flex-start" mt="md">
          <Button type="submit">
            {id ? "Update" : "Create"}
          </Button>
          <Button 
            variant="light"
            onClick={() => navigate("/dashboard/categories")}
          >
            Cancel
          </Button>
        </Group>
      </form>
    </Card>
  );
}
