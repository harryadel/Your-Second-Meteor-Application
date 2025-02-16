import React from "react";
import { MultiSelect } from "@mantine/core";
import { JsonParam, NumberParam, useQueryParams } from "use-query-params";

const FilterMultiSelect = ({
  label,
  name,
  data,
  type = "string",
}: {
  label: string;
  name: string;
  data: any[];
  type?: "string" | "number";
}) => {
  const [query, setQuery] = useQueryParams({
    filters: JsonParam,
    page: NumberParam,
  });
  return (
    <MultiSelect
      label={label}
      miw={200}
      searchable={true}
      clearable={true}
      placeholder={label}
      data={data}
      value={query.filters?.[name]?.map((v: string) => String(v))}
      onChange={x => {
        if (type === "number") {
          setQuery({
            page: 1,
            filters: { ...query.filters, [name]: x.map((v: string) => Number(v)) },
          });
        } else {
          setQuery({ page: 1, filters: { ...query.filters, [name]: x } });
        }
      }}
    />
  );
};

export default FilterMultiSelect;
