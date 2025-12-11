import * as React from 'react';
import {styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import {tabsClasses} from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import type {UserDto} from "~/dto/user/UserDto";
import Avatar from "@mui/material/Avatar";
import AppIcon from "~/img/app_icon.jpg";

const Toolbar = styled(MuiToolbar)({
    width: '100%',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px', p: '8px', pb: 0,
    },
});

interface AppNavbarProps {
    user: UserDto;
}

export default function AppNavbar({user}: AppNavbarProps) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (<AppBar
        position="fixed"
        sx={{
            display: {xs: 'auto', md: 'none'},
            boxShadow: 0,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderBottom: '1px solid',
            borderColor: 'divider',
            top: 'var(--template-frame-height, 0px)',
        }}
    >
        <Toolbar variant="regular">
            <Stack
                direction="row"
                sx={{
                    alignItems: 'center', flexGrow: 1, width: '100%', gap: 1,
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{justifyContent: 'center', mr: 'auto'}}
                >
                    <Avatar
                        sizes="medium"
                        alt="Holly's Accountability App"
                        src={AppIcon}
                        sx={{width: 100, height: 100}}
                    />
                    <Typography variant="h4" component="h1" sx={{color: 'text.primary'}}>
                        Dashboard
                    </Typography>
                </Stack>
                <ColorModeIconDropdown/>
                <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
                    <MenuRoundedIcon/>
                </MenuButton>
                <SideMenuMobile open={open} toggleDrawer={toggleDrawer} user={user}/>
            </Stack>
        </Toolbar>
    </AppBar>);
}