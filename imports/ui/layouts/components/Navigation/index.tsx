import {
  ActionIcon,
  Box,
  Code,
  Flex,
  Group,
  Navbar,
  NavbarProps,
  ScrollArea,
  Text,
} from "@mantine/core";
import React from "react";
import { IconX } from "@tabler/icons-react";
import useStyles from "./Navigation.styles";
import { useMediaQuery } from "@mantine/hooks";

// import UserProfileButton from '../UserButton/UserButton';
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { LinksGroup } from "../Links/Links";
import { PATH_PRODUCTS } from "../../routes";

const mockdata = [
  {
    title: "Products",
    links: [{ label: "Products", icon: "🏷️", link: PATH_PRODUCTS.root }],
  },
  {
    title: "Purchasing",
    links: [{ label: "Suppliers", icon: "💁‍♀️", link: "/" }],
  },

  {
    title: "Users",
    links: [
      { label: "Users", icon: "👥", link: "/" },
      { label: "Roles", icon: "🔓", link: "/" },
    ],
  },
];

type NavigationProps = { onClose: () => void } & Omit<NavbarProps, "children">;

const Navigation = ({ onClose, ...others }: NavigationProps) => {
  const { classes, theme } = useStyles();
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const { currentUser } = useTracker(
    () => ({
      currentUser: Meteor.user(),
    }),
    []
  );

  const links = mockdata.map((m) => (
    <Box pl={0} mb="md" key={m.title}>
      <Text tt="uppercase" size="xs" pl="md" fw={500} mb="sm">
        {m.title}
      </Text>
      {m.links.map((item) => (
        <LinksGroup {...item} key={item.label} />
      ))}
    </Box>
  ));

  return (
    <Navbar
      width={{ sm: 300, md: 400 }}
      px="md"
      className={classes.navbar}
      {...others}
    >
      <Navbar.Section className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group position="apart" sx={{ flex: tablet_match ? "auto" : 1 }}>
            {/* <Logo sx={{color: theme.white}}/> */}
            <Code
              sx={{
                fontWeight: 700,
                // backgroundColor: theme.colors[theme.primaryColor][9],
                // color: theme.white
              }}
            >
              v1.0.0
            </Code>
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </Navbar.Section>

      <Navbar.Section grow={true} className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {/* <UserProfileButton
                    email={currentUser.emails[0].address}
                    name={currentUser.profile?.name}
                    image=""
                    sx={{color: theme.black}}
                /> */}
      </Navbar.Section>
    </Navbar>
  );
};

export default Navigation;
