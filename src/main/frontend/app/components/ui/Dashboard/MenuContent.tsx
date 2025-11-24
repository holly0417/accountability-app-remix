import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const mainListItems = [
  { text: 'all tasks', icon: <HomeRoundedIcon />, link: '/task' },
  { text: 'task pending', icon: <HomeRoundedIcon />, link: '/task/pending' },
  { text: 'task approved', icon: <HomeRoundedIcon />, link: '/task/approved' },
  { text: 'task in progress', icon: <HomeRoundedIcon />, link: '/task/in-progress' },
  { text: 'task completed', icon: <HomeRoundedIcon />, link: '/task/completed'},
  { text: 'task rejected', icon: <HomeRoundedIcon />, link: '/task/rejected'},

  { text: 'partners', icon: <PeopleRoundedIcon />, link: '/partners'},

  { text: 'all partner tasks', icon: <PeopleRoundedIcon />, link: '/partner-task'},
  { text: 'partner task pending', icon: <HomeRoundedIcon />, link: '/partner-task/pending' },
  { text: 'partner task approved', icon: <HomeRoundedIcon />, link: '/partner-task/approved' },
  { text: 'partner task in progress', icon: <HomeRoundedIcon />, link: '/partner-task/in-progress' },
  { text: 'partner task completed', icon: <HomeRoundedIcon />, link: '/partner-task/completed'},
  { text: 'partner task rejected', icon: <HomeRoundedIcon />, link: '/partner-task/rejected'},

  { text: 'wallet, wishlist & purchases', icon: <AnalyticsRoundedIcon />, link: '/wallet-purchases'},
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0} href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
