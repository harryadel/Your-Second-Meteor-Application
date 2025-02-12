import React from "react";
import { Anchor, Text, Stack } from "@mantine/core";

const LineItem = ({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string | undefined;
  type?: "text" | "anchor";
}) => {
  if (!value) return null;
  return (
    <Stack gap={0}>
      <Text c="dimmed" size="xs">
        {label}
      </Text>
      {type === "anchor" ? (
        <Anchor href={value} target="_blank">
          {value}
        </Anchor>
      ) : (
        <Text>{value ?? "-"}</Text>
      )}
    </Stack>
  );
};

export default LineItem;
