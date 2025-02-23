import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Group, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { categoriesAdd, categoriesUpdate } from "/imports/api/methods/categories";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCategory } from "@hooks";
import { categoryInsertSchema } from "/imports/api/collections/schemas";

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: zodResolver(categoryInsertSchema),
  });

  const { data: category } = useGetCategory(id);

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
