import React, { useState } from 'react';
import { Box, Button, Collapse, Group, rem, Text } from '@mantine/core';
import { IconCalendarStats, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import useStyles from "./Links.styles";

interface LinksGroupProps {
    // icon: React.FC<any>;
    icon: any;
    label: string;
    initiallyOpened?: boolean;
    link?: string;
    links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links }: LinksGroupProps) {
    const { classes, theme } = useStyles();
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
    const navigate = useNavigate()

    const items = (hasLinks ? links : []).map((link) => (
        <Text
            component={Link}
            className={classes.link}
            href={link.link}
            key={link.label}
        >
            {link.label}
        </Text>
    ));

    return (
        <>
            <Button
                component="a"
                variant='subtle'
                className={classes.control}
                onClick={
                    (evt) => {
                        setOpened((o) => !o);
                        link && navigate(link)
                    }
                }
            >
                <Group position="apart" spacing={0}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Icon size={18} />
                        🛍️ */}
                        {Icon}
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        <ChevronIcon
                            className={classes.chevron}
                            size="1rem"
                            stroke={1.5}
                            style={{
                                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                            }}
                        />
                    )}
                </Group>
            </Button>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}

const mockdata = {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
    ],
};

export function NavbarLinksGroup() {
    return (
        <Box
            sx={(theme) => ({
                minHeight: rem(220),
                padding: theme.spacing.md,
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            })}
        >
            <LinksGroup {...mockdata} />
        </Box>
    );
}
