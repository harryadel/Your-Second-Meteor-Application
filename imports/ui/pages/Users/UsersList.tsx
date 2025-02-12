import React, { useMemo } from "react";
import { CustomDataTable, Header, FilterDate, FilterMultiSelect, FilterSearch } from "@components";
import { ActionIcon, Badge, Menu, SimpleGrid, Text } from "@mantine/core";
import { useNavigate } from "react-router";

import { useGetUsers, USERS_LIST_QUERY } from "@hooks";
import { DataTableColumn } from "mantine-datatable";
import { Meteor } from "meteor/meteor";
import { format } from "date-fns";
import { USER_STATUSES } from "/imports/constants/permissions";
import { USERS_STATUSES_COLOR_MAPPING } from "/imports/constants/permissions";

import { IconDots } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

const UsersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const suspendUser = async (userId: string) => {
    try {
      // await callAsync("users.suspend", { userId });
      queryClient.invalidateQueries({ queryKey: [USERS_LIST_QUERY] });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to suspend user",
        color: "red",
      });
    }
  };

  const activateUser = async (userId: string) => {
    try {
      // await callAsync("users.activate", { userId });
      queryClient.invalidateQueries({ queryKey: [USERS_LIST_QUERY] });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to activate user",
        color: "red",
      });
    }
  };

  const makeVIP = async (userId: string) => {
    try {
      // await callAsync("users.setVIP", { userId, isVIP: true });
      queryClient.invalidateQueries({ queryKey: [USERS_LIST_QUERY] });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to make user VIP",
        color: "red",
      });
    }
  };

  const removeVIP = async (userId: string) => {
    try {
      // await callAsync("users.setVIP", { userId, isVIP: false });
      queryClient.invalidateQueries({ queryKey: [USERS_LIST_QUERY] });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to remove user VIP",
        color: "red",
      });
    }
  };

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
        accessor: "profile.rating",
        title: "Rating",
        sortable: true,
      },
      {
        accessor: "actions",
        title: "Actions",
        render: record => {
          return (
            <Menu withArrow position="bottom" withinPortal>
              <Menu.Target>
                <ActionIcon onClick={e => e.stopPropagation()} variant="default">
                  <IconDots size={16} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {record!.profile!.status !== USER_STATUSES.SUSPENDED && (
                  <Menu.Item
                    onClick={() => {
                      suspendUser(record._id);
                    }}
                  >
                    Suspend
                  </Menu.Item>
                )}
                {record!.profile!.status !== USER_STATUSES.ACTIVE && (
                  <Menu.Item
                    onClick={() => {
                      activateUser(record._id);
                    }}
                  >
                    Activate
                  </Menu.Item>
                )}
                {!record!.profile!.isVIP && !record.profile.isPremium && (
                  <Menu.Item
                    onClick={() => {
                      makeVIP(record._id);
                    }}
                  >
                    Make VIP
                  </Menu.Item>
                )}
                {record!.profile!.isVIP && (
                  <Menu.Item
                    onClick={() => {
                      removeVIP(record._id);
                    }}
                  >
                    Remove VIP
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Header title="Users"></Header>
      <CustomDataTable
        columns={columns}
        useGetPaginatedHook={useGetUsers}
        rowBackgroundColor={record => {
          if (record.profile.isVIP) {
            return "var(--mantine-color-blue-light)";
          }
          if (record.profile.isPremium) {
            return "var(--mantine-color-green-light)";
          }
        }}
        onRowClick={row => {
          //Navigate to user details
          navigate(`/dashboard/users/${row.record._id}`);
        }}
        filterComponents={
          <form>
            <SimpleGrid cols={{ base: 1, md: 3, lg: 4 }}>
              <FilterSearch label="Search" searchFields={["profile.fullName", "username"]} />
              <FilterDate label="Created At" name="createdAt" />
              <FilterMultiSelect
                label="Status"
                name="profile.status"
                data={Object.values(USER_STATUSES)}
              />
            </SimpleGrid>
          </form>
        }
        sortProps={{
          columnAccessor: "createdAt",
          direction: "desc",
        }}
      ></CustomDataTable>
    </>
  );
};

export default UsersList;
