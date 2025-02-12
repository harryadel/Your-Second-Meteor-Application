import {
  TextInput as MantineTextInput,
  Box,
  TextInputProps as MantineTextInputProps,
} from "@mantine/core";
import { useField } from "formik";
import React from "react";

interface TextInputProps extends MantineTextInputProps {
  flex?: number;
  name: string;
}

export default function TextInput({ flex, name, ...props }: TextInputProps) {
  const [
    { value, onBlur: formikOnBlur },
    { error, touched },
    { setValue, setTouched },
  ] = useField(name);

  return (
    <Box style={{ flex: flex }}>
      <MantineTextInput
        {...props}
        error={touched && error}
        value={value}
        onBlur={(e) => {
          formikOnBlur(e);
          setTouched(true);
        }}
        onChange={(v) => {
          setValue(v.target.value);
        }}
      />
    </Box>
  );
}
