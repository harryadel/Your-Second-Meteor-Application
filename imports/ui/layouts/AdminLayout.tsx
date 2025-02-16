import React from "react";
import { AppShell, Burger, Group, ScrollArea, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "./AdminLayout.styles.css";
import { IconBrandProducthunt, IconCalendarStats, IconGauge } from "@tabler/icons-react";
import { LinksGroup } from "./components/NavbarLinksGroup";
import { Route, Routes } from "react-router-dom";
import { UsersList, Dashboard, ProductForm, ProductList } from "@pages";
const AdminLayout = () => {
  const [opened, { toggle }] = useDisclosure(true);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened, desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Title order={2}>Determinds</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products">
            <Route index element={<ProductList />} />
            <Route path="add" element={<ProductForm />} />
            <Route path=":id/edit" element={<ProductForm />} />
          </Route>
          <Route path="/users">
            <Route element={<UsersList />} />
          </Route>
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;

const Navbar = () => {
  const links = collections.map(item => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={"navbar"}>
      <ScrollArea className={"links"}>
        <div className={"linksInner"}>{links}</div>
      </ScrollArea>

      <div className={"footer"}>{/* <UserButton /> */}</div>
    </nav>
  );
};

const collections = [
  { label: "Dashboard", icon: IconGauge, link: "/" },
  {
    label: "Products",
    icon: IconBrandProducthunt,
    link: "/dashboard/products",
  },

  {
    label: "Users",
    icon: IconCalendarStats,
    link: "/dashboard/users",
    links: [
      { label: "All", link: "/dashboard/users/all" },
      { label: "Without Assets", link: "/dashboard/users/without-assets" },
      { label: "Without Matches", link: "/dashboard/users/without-matches" },
    ],
  },
];
