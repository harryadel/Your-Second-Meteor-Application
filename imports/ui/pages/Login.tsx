import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { Meteor } from "meteor/meteor";
import { Navigate } from "react-router";
import { handleMeteorError } from "../utils/notifications";
import { useTracker } from "meteor/react-meteor-data";
import logger from "../../utils/logger";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Enter your password" }),
  code: z.string().optional(),
});

const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldAskCode, setShouldAskCode] = useState(false);
  const user = useTracker(() => Meteor.user());
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      code: "",
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  const submit = (doc: any) => {
    setIsLoading(true);
    const { email, password, code } = doc;
    if (shouldAskCode) {
      logger.debug("Login state", { shouldAskCode });
      Meteor.loginWithPasswordAnd2faCode(email, password, code, err => {
        if (err instanceof Meteor.Error) {
          handleMeteorError(err.reason!);
          setIsLoading(false);
        } else {
          setRedirect(true);
        }
      });
    } else {
      Meteor.loginWithPassword(email, password, err => {
        if (err instanceof Meteor.Error) {
          if (err.error === "no-2fa-code") {
            // send user to a page or show a component
            // where they can provide a 2FA code
            setShouldAskCode(true);
            setIsLoading(false);
            return;
          } else {
            handleMeteorError(err.reason!);
          }
          setIsLoading(false);
        } else {
          setRedirect(true);
        }
      });
    }
  };

  if (redirect || user) {
    return <Navigate to="/dashboard/" />;
  }

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={theme => ({
          // fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text size="md" mt={5} color="dimmed" align="center">
        Determinds Project
      </Text>
      {/* <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Text> */}

      <Paper withBorder={true} shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(values => submit(values))}>
          <TextInput
            label="Email"
            placeholder="user@example.com"
            required={true}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required={true}
            mt="md"
            {...form.getInputProps("password")}
          />
          {shouldAskCode && (
            <Stack mt="md" align="center">
              <Text>Enter the 6 digit code you got from the app</Text>
              <PinInput
                {...form.getInputProps("code")}
                type="number"
                autoFocus={true}
                length={6}
              ></PinInput>
            </Stack>
          )}
          <Group position="center" mt="lg">
            {/* <Checkbox label="Remember me" /> */}
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth={true} mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
