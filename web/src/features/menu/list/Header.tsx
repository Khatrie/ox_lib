import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

/* TODO: WRAP A BORDER AROUND THE WHOLE BOX */

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderLeft: `1px solid ${theme.colors.grey[5]}`,
    borderRight: `1px solid ${theme.colors.grey[5]}`,
    borderTop: `1px solid ${theme.colors.grey[5]}`,
    borderTopLeftRadius: theme.radius.sm,
    borderTopRightRadius: theme.radius.sm,
    backgroundColor: theme.colors.black2[5],
    height: 'auto',
    width: 384,
    paddingTop: 30,
    paddingBottom: 30,
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  heading: {
    fontSize: 26,
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 10,
  },
  line: {
    width: '100%',
    height: 3,
    background: '#0099ad',
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
      <div className={classes.line} />
    </Box>
  );
};

export default React.memo(Header);
