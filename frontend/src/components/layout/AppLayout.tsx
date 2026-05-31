import { Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import classes from './AppLayout.module.css';

export function AppLayout() {
  return (
    <Box className={classes.root}>
      <Topbar />
      <Box className={classes.body}>
        <Sidebar />
        <Box component="main" className={classes.main}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
