import { Button, Divider, Drawer, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetNotificationTemplates } from "@hooks";
import { IconSend } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
// import callAsync from "../../utils/callAsync";
import { showNotification } from "@mantine/notifications";
import { handleMeteorSuccess } from "../../utils/notifications";

const UserSendNotification = forwardRef(({}, ref) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [userId, setUserId] = useState<string | null>(null);
  useImperativeHandle(ref, () => ({
    open: (userId: string) => {
      open();
      setUserId(userId);
    },
    close: () => close(),
  }));

  const { data } = useGetNotificationTemplates({});
  const notificationTemplates = data?.data;

  const form = useForm({
    initialValues: {
      title: "",
      message: "",
    },
    validate: zodResolver(schema),
  });
  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close();
      }}
      title="Send Notification"
      position="right"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <form
        onSubmit={form.onSubmit(async values => {
          const { message, title } = values;
          // await callAsync("notificationTemplates.send", {
          //   userId,
          //   title: title,
          //   message: message,
          // });
          handleMeteorSuccess("Notification sent successfully");
          form.reset();
          close();
        })}
      >
        <Stack>
          <Select
            label="Select NotificationTemplate"
            searchable={true}
            data={notificationTemplates?.map(template => ({
              value: template._id!,
              label: template.title!,
            }))}
            onChange={value => {
              const selectedTemplate = notificationTemplates?.find(
                template => template._id === value
              );
              form.setFieldValue("title", selectedTemplate?.title || "");
              form.setFieldValue("message", selectedTemplate?.description || "");
            }}
          />
          <Divider label="Or Write Your Own Message" />
          <TextInput disabled={form.submitting} label="Title" {...form.getInputProps("title")} />
          <Textarea disabled={form.submitting} label="Message" {...form.getInputProps("message")} />

          <Button
            disabled={form.submitting}
            loading={form.submitting}
            type="submit"
            rightSection={<IconSend />}
          >
            Send
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
});

export default UserSendNotification;

const schema = z.object({
  title: z.string().min(3, { message: "Title should have at least 3 letters" }).max(100, {
    message: "Title should have at most 100 letters",
  }),
  message: z.string().min(3, { message: "Message should have at least 3 letters" }).max(1000, {
    message: "Message should have at most 1000 letters",
  }),
});
