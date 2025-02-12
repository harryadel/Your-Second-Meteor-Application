import React, { useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserDetails, USER_DETAILS_QUERY } from "@hooks";
import {
  Card,
  Text,
  Title,
  Loader,
  Stack,
  Grid,
  CardSection,
  Image,
  Rating,
  ActionIcon,
  Group,
  Button,
  Badge,
  Tabs,
  useMantineTheme,
  Anchor,
} from "@mantine/core";
import { LineItemHorizontal } from "@components";
import { format } from "date-fns";
import { IconCircle0Filled, IconCurrencyDollar, IconSend } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
// import callAsync from "../../utils/callAsync";
import { useQueryClient } from "@tanstack/react-query";
import UserSendNotification from "./UserSendNotification";
import { DataTable, DataTableColumn } from "mantine-datatable";
import {
  PRICE_TYPES_ALLOWED_MAPPING,
  PROPERTY_STATUSES_COLOR_MAPPING,
} from "/imports/constants/settings";
import { IconCalendarDollar } from "@tabler/icons-react";

const UsersDetails = () => {
  const { id } = useParams();
  const theme = useMantineTheme();
  const { data, isLoading } = useGetUserDetails(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userSendNotificationRef = useRef<any>(null);
  const updateRating = (value: number) => {
    modals.openConfirmModal({
      title: "Update Rating",
      children: <Text>Are you sure you want to update the rating to {value}?</Text>,
      labels: { confirm: "Update", cancel: "Cancel" },
      onConfirm: async () => {
        // await callAsync("users.updateRating", {
        //   userId: id,
        //   rating: value,
        // });
        queryClient.invalidateQueries({ queryKey: [USER_DETAILS_QUERY, id] });
      },
    });
  };

  const propertiesColumns = useMemo(() => {
    return [
      {
        accessor: "images",
        title: "Image",
        render: row =>
          row.images?.length > 0 ? (
            <Image
              style={{ width: 50, height: 50 }}
              fit="cover"
              radius={"sm"}
              src={row.images[0].url}
              alt="Property Image"
              fallbackSrc="/images/placeholder.jpg"
            />
          ) : (
            <Text>No Image</Text>
          ),
      },
      { accessor: "title", title: "Title" },
      {
        accessor: "status",
        title: "Status",
        render: row => (
          <Badge color={PROPERTY_STATUSES_COLOR_MAPPING[row.status]}>{row.status}</Badge>
        ),
      },
      {
        accessor: "type.type1",
        title: "Contract",
      },
      {
        accessor: "type.type3",
        title: "Property Type",
      },
      {
        accessor: "loc.loc",
        title: "Location",
        sortable: true,
        render: row => (
          <Stack gap={0}>
            <Text size="xs">{row.loc?.subArea?.name?.en}</Text>
            <Text size="xs">{row.loc?.area?.name?.en}</Text>
            <Text size="xs">{row.loc?.city?.name?.en}</Text>
            <Text size="xs">{row.loc?.province?.name?.en}</Text>
          </Stack>
        ),
      },
      {
        accessor: "createdOn",
        title: "Created On",
        sortable: true,
        render: row => (row.createdOn ? format(row.createdOn!, "P") : "-"),
      },
      {
        accessor: "modifiedOn",
        title: "Modified On",
        sortable: true,
        render: row => (row.modifiedOn ? format(row.modifiedOn!, "P") : "-"),
      },
      {
        accessor: "area.area",
        title: "Area",
        sortable: true,
        textAlign: "right",
        render: row => (row.area ? `${row.area.surface?.toLocaleString()}` : "-"),
      },
      {
        accessor: "price.type",
        title: "",
        sortable: true,
        textAlign: "right",
        render: row =>
          row.price?.type === PRICE_TYPES_ALLOWED_MAPPING.installments ? (
            <IconCalendarDollar size={16} />
          ) : (
            <IconCurrencyDollar size={16} />
          ),
      },
      {
        accessor: "price",
        title: "Price",
        sortable: true,
        textAlign: "right",
        render: row => row.price?.amount?.toLocaleString(),
      },
    ];
  }, []);
  const requestsColumns = useMemo(() => {
    return [
      { accessor: "title", title: "Title" },
      {
        accessor: "status",
        title: "Status",
        sortable: true,
        render: row => (
          <Badge color={PROPERTY_STATUSES_COLOR_MAPPING[row.status]}>{row.status}</Badge>
        ),
      },
      {
        accessor: "type.type1",
        title: "Contract",
        sortable: true,
      },
      {
        accessor: "type.type3",
        title: "Property Type",
        sortable: true,
      },
      {
        accessor: "loc.loc",
        title: "Location",
        sortable: true,
        render: row => (
          <Stack gap={0}>
            <Text size="xs">{row.loc?.subArea?.name?.en}</Text>
            <Text size="xs">{row.loc?.area?.name?.en}</Text>
            <Text size="xs">{row.loc?.city?.name?.en}</Text>
            <Text size="xs">{row.loc?.province?.name?.en}</Text>
          </Stack>
        ),
      },
      {
        accessor: "createdOn",
        title: "Created On",
        sortable: true,
        render: row => (row.createdOn ? format(row.createdOn!, "P") : "-"),
      },
      {
        accessor: "modifiedOn",
        title: "Modified On",
        sortable: true,
        render: row => (row.modifiedOn ? format(row.modifiedOn!, "P") : "-"),
      },
      {
        accessor: "area.area",
        title: "Area",
        sortable: true,
        textAlign: "right",
        render: row => (row.area ? `${row.area.surface?.toLocaleString()}` : "-"),
      },
      {
        accessor: "price.type",
        title: "",
        sortable: true,
        textAlign: "right",
        render: row =>
          row.price?.type === PRICE_TYPES_ALLOWED_MAPPING.installments ? (
            <IconCalendarDollar size={16} />
          ) : (
            <IconCurrencyDollar size={16} />
          ),
      },
      {
        accessor: "price",
        title: "Price",
        sortable: true,
        textAlign: "right",
        render: row => row.price?.amount?.toLocaleString(),
      },
    ];
  }, []);

  const matchesColumns = useMemo((): DataTableColumn<any>[] => {
    return [
      {
        accessor: "createdOn",
        title: "Created On",
        render: row => (row.createdOn ? format(row.createdOn!, "P") : "-"),
      },
      {
        accessor: "seen",
        title: "Seen",
        render: row => (row.seen ? "Yes" : "No"),
      },
      {
        accessor: "ownerOf",
        title: "Owner Of",
      },
      {
        accessor: "score",
        title: "Score",
        render: row => row.score?.toLocaleString(),
        cellsStyle: (record, index) => ({
          backgroundColor:
            record.score > 0
              ? theme.colors.lime[Math.max(0, Math.min(Math.round(record.score), 10))]
              : theme.colors.pink[Math.max(0, Math.min(Math.round(record.score), 10))],
        }),
      },
      {
        accessor: "property.title",
        title: "Property",
        render: row => (
          <Anchor component={Link} to={`/dashboard/properties/${row?.property?._id}`}>
            {row?.property?.title}
          </Anchor>
        ),
      },
      {
        accessor: "request.title",
        title: "Request",
        render: row => (
          <Anchor component={Link} to={`/dashboard/requests/${row?.request?._id}`}>
            {row?.request?.title}
          </Anchor>
        ),
      },
    ];
  }, []);

  if (isLoading) return <Loader />;
  return (
    <>
      <Stack>
        <Group justify="flex-end">
          <Button
            onClick={() => {
              userSendNotificationRef.current?.open(id);
            }}
            rightSection={<IconSend />}
          >
            Send Notification
          </Button>
        </Group>
        <Grid gutter={"sm"}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md">
              <CardSection withBorder p="xs">
                <Title order={5}>User Info</Title>
              </CardSection>
              <CardSection withBorder p="xs">
                <Stack>
                  <LineItemHorizontal label="Name" value={data?.profile?.fullName} />
                  <LineItemHorizontal label="Username" value={data?.username} />
                  <LineItemHorizontal label="Email" value={data?.emails[0]?.address} />
                </Stack>
              </CardSection>
              <CardSection withBorder p="xs">
                <Stack>
                  <LineItemHorizontal label="Joined At" value={format(data?.createdAt, "Pp")} />
                  <LineItemHorizontal
                    label="Last Login"
                    value={format(data?.status?.lastLogin.date, "Pp")}
                  />
                </Stack>
              </CardSection>
              <CardSection withBorder p="xs">
                <Stack>
                  <LineItemHorizontal label="Role" value={data?.role} />
                  <LineItemHorizontal label="Status" value={data?.profile?.status} />
                  <LineItemHorizontal
                    label="Premium"
                    value={data?.profile?.isPremium ? "Yes" : "No"}
                  />
                  <LineItemHorizontal label="VIP" value={data?.profile?.isVIP ? "Yes" : "No"} />
                </Stack>
              </CardSection>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md">
              <CardSection withBorder p="xs">
                <Title order={5}>User Image</Title>
              </CardSection>
              <CardSection withBorder p="xs">
                <Image
                  fallbackSrc="/images/placeholder.jpg"
                  src={data?.profile?.image?.url}
                  alt="User Image"
                />
              </CardSection>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder radius="md">
              <CardSection withBorder p="xs">
                <Group justify="space-between">
                  <Title order={5}>Rating</Title>
                  <ActionIcon
                    variant="light"
                    onClick={() => {
                      updateRating(0);
                    }}
                  >
                    <IconCircle0Filled />
                  </ActionIcon>
                </Group>
              </CardSection>
              <CardSection withBorder p="xs">
                <Rating value={data.profile.rating} onChange={updateRating} />
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder radius="md">
          <Tabs defaultValue="chat">
            <Tabs.List>
              <Tabs.Tab value="properties" rightSection={<Badge>{data?.properties?.length}</Badge>}>
                Properties
              </Tabs.Tab>
              <Tabs.Tab value="requests" rightSection={<Badge>{data?.requests?.length}</Badge>}>
                Requests
              </Tabs.Tab>
              <Tabs.Tab value="matches" rightSection={<Badge>{data?.matches?.length}</Badge>}>
                Matches
              </Tabs.Tab>
              <Tabs.Tab value="chats" rightSection={<Badge>{data?.chats?.length}</Badge>}>
                Chats
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="properties">
              <DataTable
                minHeight={200}
                records={data?.properties}
                columns={propertiesColumns}
                verticalSpacing="xs"
                borderRadius={"0.25rem"}
                onRowClick={row => {
                  navigate(`/dashboard/properties/${row.record._id}`);
                }}
                highlightOnHover
                emptyState={<Text>No properties found</Text>}
              ></DataTable>
            </Tabs.Panel>
            <Tabs.Panel value="requests">
              <DataTable
                minHeight={200}
                records={data?.requests}
                columns={requestsColumns}
                verticalSpacing="xs"
                borderRadius={"0.25rem"}
                onRowClick={row => {
                  navigate(`/dashboard/requests/${row.record._id}`);
                }}
                highlightOnHover
                emptyState={<Text>No requests found</Text>}
              ></DataTable>
            </Tabs.Panel>
            <Tabs.Panel value="matches">
              <DataTable
                minHeight={200}
                records={data?.matches}
                columns={matchesColumns}
                verticalSpacing="xs"
                borderRadius={"0.25rem"}
                highlightOnHover
                emptyState={<Text>No matches found</Text>}
              ></DataTable>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
      <UserSendNotification ref={userSendNotificationRef} />
    </>
  );
};

export default UsersDetails;
