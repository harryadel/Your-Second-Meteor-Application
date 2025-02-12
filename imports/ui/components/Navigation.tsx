import React, { useState } from "react";
import { Group, Code, Image } from "@mantine/core";
import {
  IconBellRinging,
  IconSwitchHorizontal,
  IconLogout,
} from "@tabler/icons-react";
import "./Navigation.css";
import { Link } from "react-router-dom";

const data = [
  { link: "/dashboard/products", label: "Products", icon: IconBellRinging },
];

export function Navigation() {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <Link
      className="link"
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className="linkIcon" stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className="navbar">
      <div className="navbarMain">
        <Group className="header" justify="space-between">
          <Image src="images/shift_logo.png" w={48} alt="The Shift 180" />
          <Code fw={700}>username</Code>
        </Group>
        {links}
      </div>

      <div className="footer">
        <a
          href="#"
          className="link"
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className="linkIcon" stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className="link"
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className="linkIcon" stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
