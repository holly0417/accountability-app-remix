import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import CustomizedTreeView from "~/dashboard/ui/Dashboard/CustomizedTreeView";
import {useLoaderData} from "react-router-dom";
import type {clientLoader} from "~/routes/_index";
import AppIcon from "./../../../../../resources/static/app_icon.jpg";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
    const { currentUserInfo } = useLoaderData<typeof clientLoader>();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
        <Stack spacing={2} sx={{ alignItems: 'center' }}>

        <Box></Box>

            <Avatar
                sizes="medium"
                alt="Holly's Accountability App"
                src={AppIcon}
                sx={{ width: 100, height: 100 }}
            />

        <Divider />
        </Stack>

        <Stack
            direction="row"
            sx={{
                p: 2,
                gap: 1,
                alignItems: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ mr: 'auto' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                    {currentUserInfo!.username}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {currentUserInfo!.email}
                </Typography>
            </Box>

            <OptionsMenu />
        </Stack>

      <Divider />

      <Box
        sx={{
          overflowY: 'auto',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomizedTreeView />
      </Box>



    </Drawer>
  );
}
