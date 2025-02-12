import { SegmentedControl, Stack } from "@mantine/core";
import { Text } from "@mantine/core";
import React from "react";
import { JsonParam, NumberParam, useQueryParams } from "use-query-params";
import * as _ from "underscore";
const FilterDate = ({
  label,
  name,
  trueLabel = "Yes",
  falseLabel = "No",
}: {
  label: string;
  name: string;
  trueLabel: string;
  falseLabel: string;
}) => {
  const [query, setQuery] = useQueryParams({
    filters: JsonParam,
    page: NumberParam,
  });
  return (
    <Stack gap={0}>
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <SegmentedControl
        data={[
          { label: "All", value: "null" },
          { label: trueLabel, value: "true" },
          { label: falseLabel, value: "false" },
        ]}
        value={
          query.filters?.[name] === true
            ? "true"
            : query.filters?.[name] === false
            ? "false"
            : "null"
        }
        onChange={x => {
          switch (x) {
            case "true":
              setQuery({ page: 1, filters: { ...query.filters, [name]: true } });
              break;
            case "false":
              setQuery({ page: 1, filters: { ...query.filters, [name]: false } });
              break;
            default:
              setQuery({ page: 1, filters: { ..._.omit(query.filters, name) } }); //Removing the filter
              break;
          }
        }}
      ></SegmentedControl>
    </Stack>
  );
};

export default FilterDate;
