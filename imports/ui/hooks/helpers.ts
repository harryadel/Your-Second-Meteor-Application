export function cleanFilters(filters: any) {
  if (filters?.createdOn) {
    if (filters.createdOn[0]) {
      filters.createdOnFrom = new Date(filters.createdOn[0]).toISOString() ?? undefined;
    }
    if (filters.createdOn[1]) {
      filters.createdOnTo = new Date(filters.createdOn[1]).toISOString() ?? undefined;
    }
    delete filters.createdOn;
  }
  if (filters?.createdFrom) {
    filters.createdFrom = new Date(filters.createdFrom).toISOString() ?? undefined;
    delete filters.createdFrom;
  }
  if (filters?.createdTo) {
    filters.createdTo = new Date(filters.createdTo).toISOString() ?? undefined;
    delete filters.createdTo;
  }
  if (filters?.modifiedOn) {
    if (filters.modifiedOn[0]) {
      filters.modifiedOnFrom = new Date(filters.modifiedOn[0]).toISOString() ?? undefined;
    }
    if (filters.modifiedOn[1]) {
      filters.modifiedOnTo = new Date(filters.modifiedOn[1]).toISOString() ?? undefined;
    }
    delete filters.modifiedOn;
  }
  if (filters?.createdAt) {
    if (filters.createdAt[0]) {
      filters.createdAtFrom = new Date(filters.createdAt[0]).toISOString() ?? undefined;
    }
    if (filters.createdAt[1]) {
      filters.createdAtTo = new Date(filters.createdAt[1]).toISOString() ?? undefined;
    }
    delete filters.createdAt;
  }
  if (filters?.dateRange) {
    if (filters.dateRange[0]) {
      filters.dateRangeFrom = new Date(filters.dateRange[0]).toISOString() ?? undefined;
    }
    if (filters.dateRange[1]) {
      filters.dateRangeTo = new Date(filters.dateRange[1]).toISOString() ?? undefined;
    }
    delete filters.dateRange;
  }
}

export function convertObjectToArray(filters: Object) {
  if (!filters) return [];
  return Object.entries(filters).map(([field, value]) => {
    if (Array.isArray(value)) {
      return {
        field,
        values: value,
      };
    }
    return {
      field,
      value,
    };
  });
}
