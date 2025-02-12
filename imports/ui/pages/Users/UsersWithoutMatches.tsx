import React, { useMemo } from "react";
import { CustomDataTable, Header } from "@components";

import { useGetUsersWithoutMatches } from "@hooks";
import { DataTableColumn } from "mantine-datatable";
import { format } from "date-fns";
import { Badge, Text } from "@mantine/core";
import { Meteor } from "meteor/meteor";
import { USER_STATUSES, USERS_STATUSES_COLOR_MAPPING } from "/imports/constants/permissions";
import { useNavigate } from "react-router-dom";

const UsersWithoutMatches = () => {
  const navigate = useNavigate();
  const columns = useMemo<DataTableColumn<Meteor.User>[]>(
    () => [
      {
        accessor: "profile.fullName",
        title: "Name",
        sortable: true,
      },
      {
        accessor: "username",
        title: "Phone",
        sortable: true,
      },
      {
        accessor: "emails.address",
        title: "Email",
        sortable: true,
        render: (record, index) => {
          return <Text>{record!.emails![0]!.address}</Text>;
        },
      },
      {
        accessor: "profile.status",
        title: "Status",
        sortable: true,
        render: record => {
          return (
            <Badge color={USERS_STATUSES_COLOR_MAPPING[record!.profile!.status as USER_STATUSES]}>
              {record!.profile!.status}
            </Badge>
          );
        },
      },
      {
        accessor: "createdAt",
        title: "Created On",
        sortable: true,
        render: (record, index) => {
          return <Text>{format(record!.createdAt!, "Pp")}</Text>;
        },
      },
      {
        accessor: "status.lastLogin.date",
        title: "Last Login",
        sortable: true,
        render: record => {
          return (
            <Text>
              {record!.status?.lastLogin?.date
                ? format(record!.status?.lastLogin?.date!, "Pp")
                : "-"}
            </Text>
          );
        },
      },
      {
        accessor: "propertiesCount",
        title: "Properties",
        render: row => (row.propertiesCount ? row.propertiesCount.toLocaleString() : "-"),
      },
      {
        accessor: "requestsCount",
        title: "Requests",
        render: row => (row.requestsCount ? row.requestsCount.toLocaleString() : "-"),
      },
    ],
    []
  );

  return (
    <>
      <Header title="Users Without Matches"></Header>
      <CustomDataTable<Meteor.User[]>
        columns={columns}
        useGetPaginatedHook={useGetUsersWithoutMatches}
        onRowClick={row => {
          //Navigate to user details
          navigate(`/dashboard/users/${row.record._id}`);
        }}
      ></CustomDataTable>
    </>
  );
};

export default UsersWithoutMatches;
