import React from "react";
import { Anchor, Text, Group } from "@mantine/core";

const LineItemHorizontal = ({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string | number | undefined;
  type?: "text" | "anchor";
}) => {
  if (!value) return null;

  return (
    <Group justify="space-between">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      {type === "anchor" ? (
        <Anchor href={`${value}`} target="_blank">
          Link
        </Anchor>
      ) : (
        <Text size="sm">{`${value}` ?? "-"}</Text>
      )}
    </Group>
  );
};

export default LineItemHorizontal;
