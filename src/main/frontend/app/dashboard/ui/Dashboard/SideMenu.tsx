import {styled} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, {drawerClasses} from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OptionsMenu from './OptionsMenu';
import CustomizedTreeView from "~/dashboard/ui/Dashboard/CustomizedTreeView";
import AppIcon from "~/img/app_icon.jpg";
import {useNavigate} from "react-router";
import IconButton from "@mui/material/IconButton";
import type {UserDto} from "~/dto/user/UserDto";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth, flexShrink: 0, boxSizing: 'border-box', mt: 10, [`& .${drawerClasses.paper}`]: {
        width: drawerWidth, boxSizing: 'border-box',
    },
});

interface SideMenuProps {
    user: UserDto
}

export default function SideMenu({user}: SideMenuProps) {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    return (<Drawer
            variant="permanent"
            sx={{
                display: {xs: 'none', md: 'block'}, [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >

            <Box>
                <Stack spacing={5} sx={{alignItems: 'center'}}>
                    <Box></Box>
                    <IconButton onClick={goToHome}>
                        <Avatar
                            sizes="medium"
                            alt="Holly's Accountability App"
                            src={AppIcon}
                            sx={{width: 100, height: 100}}
                        />
                    </IconButton>
                    <Divider/>
                </Stack>
            </Box>

            <Stack
                direction="row"
                sx={{
                    p: 2, gap: 1, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider',
                }}
            >
                <Box sx={{mr: 'auto'}}>
                    <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                        {user.username}
                    </Typography>
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        {user.email}
                    </Typography>
                </Box>
                <OptionsMenu/>
            </Stack>

            <Divider/>

            <Box
                sx={{
                    overflowY: 'auto', height: 'fit-content', display: 'flex', flexDirection: 'column',
                }}
            >
                <CustomizedTreeView/>
            </Box>


        </Drawer>);
}
