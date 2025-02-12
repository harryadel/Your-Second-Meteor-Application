import React, { ReactElement } from "react";
import { Button, Group, Stack, Title, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router";

type PageHeaderProps = {
  title: string;
  withActions?: boolean;
  breadcrumbs?: any;
  actions?: ReactElement;
  status?: string;
  rightElement?: ReactElement;
  addButton?: boolean;
  addButtonText?: string;
};

const Header = ({
  withActions,
  breadcrumbs,
  title,
  actions,
  status,
  rightElement,
  addButton,
  addButtonText,
}: PageHeaderProps) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  return (
    <>
      <Group justify="space-between" mb="20px">
        <Stack ml="30px">
          <Title fw={700} size="28px">
            {title}
          </Title>
        </Stack>
        {rightElement && <Group gap="xs">{rightElement}</Group>}
        {addButton && (
          <Group>
            <Button
              variant="filled"
              onClick={() => {
                navigate("add");
              }}
            >
              {addButtonText}
            </Button>
          </Group>
        )}
      </Group>
    </>
  );
};

export default Header;
