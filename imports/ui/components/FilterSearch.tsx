import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "@mantine/core";
import { JsonParam, NumberParam, useQueryParams } from "use-query-params";
import { useDebouncedValue } from "@mantine/hooks";

const FilterSearch = ({ label, searchFields }: { label: string; searchFields: string[] }) => {
  const [query, setQuery] = useQueryParams({
    filters: JsonParam,
    page: NumberParam,
  });

  const [searchTextState, setSearchTextState] = useState(query.filters?.search?.searchText);
  const [debouncedSearchText] = useDebouncedValue(searchTextState, 200);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setQuery(
      {
        page: 1,
        filters: {
          ...query.filters,
          search: { searchText: debouncedSearchText, fields: searchFields },
        },
      },
      "replace"
    );
  }, [debouncedSearchText]);

  return (
    <TextInput
      label={label}
      value={searchTextState}
      onChange={event => {
        setSearchTextState(event.currentTarget.value);
      }}
    />
  );
};

export default FilterSearch;
