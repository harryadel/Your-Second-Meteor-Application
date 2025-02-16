import { DatePickerInput } from "@mantine/dates";
import React from "react";
import { JsonParam, NumberParam, useQueryParams } from "use-query-params";

const FilterDate = ({ label, name }: { label: string; name: string }) => {
  const [query, setQuery] = useQueryParams({
    filters: JsonParam,
    page: NumberParam,
  });
  return (
    <DatePickerInput
      type="range"
      clearable={true}
      miw={200}
      label={label}
      value={query.filters?.[name]?.map((x: any) => (x ? new Date(x) : undefined))}
      onChange={x => {
        setQuery({ page: 1, filters: { ...query.filters, [name]: x } });
      }}
    />
  );
};

export default FilterDate;
