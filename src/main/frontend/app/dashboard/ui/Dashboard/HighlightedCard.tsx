import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {useNavigate} from "react-router";

export default function HighlightedCard() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    const onClick = () => {
        navigate('/task');
    }


    return (<Card sx={{height: '100%'}}>
            <CardContent>
                <InsightsRoundedIcon/>
                <Typography
                    component="h2"
                    variant="subtitle2"
                    gutterBottom
                    sx={{fontWeight: '600'}}
                >
                    Need to get a task done?
                </Typography>
                <Typography sx={{color: 'text.secondary', mb: '8px'}}>
                    Start a task that your partners will keep you accountable for.
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    endIcon={<ChevronRightRoundedIcon/>}
                    fullWidth={isSmallScreen}
                    onClick={onClick}
                >
                    Start now
                </Button>
            </CardContent>
        </Card>);
}
