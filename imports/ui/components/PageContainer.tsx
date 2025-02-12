import { Box, Container, Flex, ScrollArea, rem } from "@mantine/core";
import React, { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  bottom?: ReactNode;
};

const PageContainer = ({ children, bottom }: PageContainerProps) => {
  return (
    <Flex pt="lg" direction={"column"}>
      <ScrollArea h="100%">
        {children}
        {bottom && (
          <Box>
            <Container w="100%" size={"xl"} px={0}>
              <Flex
                h={70}
                direction={"row"}
                justify={"end"}
                align={"center"}
                gap={"md"}
              >
                {bottom}
              </Flex>
            </Container>
          </Box>
        )}
      </ScrollArea>
    </Flex>
  );
};

export default PageContainer;
