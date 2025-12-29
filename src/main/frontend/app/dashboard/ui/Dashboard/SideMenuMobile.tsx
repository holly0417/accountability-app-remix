import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AppIcon from "~/img/app_icon.jpg";
import CustomizedTreeView from "~/dashboard/ui/Dashboard/CustomizedTreeView";
import {api} from "~/axios";
import type {AxiosError} from "axios";
import {useNavigate} from "react-router";
import type {UserDto} from "~/dto/user/UserDto";
import OptionsMenu from "~/dashboard/ui/Dashboard/OptionsMenu";
import HighlightedCard from "~/dashboard/ui/Dashboard/HighlightedCard";
import IconButton from "@mui/material/IconButton";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  user: UserDto;
}

export default function SideMenuMobile({ open, toggleDrawer, user }: SideMenuMobileProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        api.post('/logout')
            .then(() => navigate('/login'))
            .catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    alert("Logout failed")
                }
            })
    };

    const goToHome = () => {
        navigate('/');
    };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 2, alignItems: 'center', flexGrow: 2, p: 2 }}
          >
              <Avatar
                  sizes="medium"
                  alt="Holly's Accountability App"
                  src={AppIcon}
                  onClick={goToHome}
                  sx={{width: 60, height: 60}}
              />
              <Typography variant="h6" sx={{fontWeight: 500, lineHeight: '20px'}}>
                  {user.username}
              </Typography>
          </Stack>

            <Stack
                direction="row"
                sx={{
                    p: 2, gap: 1, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider',
                }}
            >
                <OptionsMenu/>
            </Stack>

        </Stack>

        <Divider />

        <Stack sx={{ flexGrow: 1 }}>
            <CustomizedTreeView/>
          <Divider />
        </Stack>

        <HighlightedCard />

        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleLogout} fullWidth startIcon={<LogoutRoundedIcon />}>
            Logout
          </Button>
        </Stack>

      </Stack>
    </Drawer>
  );
}
