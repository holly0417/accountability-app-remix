//template taken from free examples in material UI library

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import ColorModeSelect from '~/dashboard/shared-theme/ColorModeSelect';
import {SitemarkIcon} from '~/dashboard/ui/SignIn/CustomIcons';
import {NavLink, useNavigate} from "react-router";
import Popover from '@mui/material/Popover';
import axios from 'axios';
import type {RegisterUser} from "~/dto/user/RegisterUser";
import {useForm} from 'react-hook-form';

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    }, ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat', ...theme.applyStyles('dark', {
            backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function Registration(props: { disableCustomTheme?: boolean }) {
    //RegisterUser info
    const {register, handleSubmit} = useForm({
        defaultValues: {
            username: '', name: '', email: '', password: '', passwordRepeated: '',
        } as RegisterUser
    });

    //setup for Popover form submit error message
    const [submitError, setSubmitError] = React.useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = React.useState('');

    //anchorEl is WHERE the popover is
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(submitError);
    const id = open ? 'simple-popover' : undefined;

    //Popper opens when an error is detected. & closes when clicked away
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setSubmitError(false);
    };

    const navigate = useNavigate();

    const api = axios.create({
        baseURL: '/', headers: {'Content-Type': 'application/json',}, maxRedirects: 0
    });

    const onSubmit = async (data: RegisterUser) => {
        await api.post<RegisterUser>('/registration', data)
            .then(response => {
                console.log(response);
                navigate('/');
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error message:', error.response.data.violations[0].messages[3]);
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);

                    const errorMessage = error.response.data.violations[0].messages[3];

                    setSubmitErrorMessage(errorMessage);
                    setSubmitError(true);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    };

    return (<AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon/>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <TextField
                                autoComplete="username"
                                {...register("username")}
                                required
                                fullWidth
                                id="username"
                                placeholder="JonSnow45"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <TextField
                                autoComplete="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Jon Snow"
                                {...register("name")}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                {...register("email")}
                                placeholder="your@email.com"
                                id="email"
                                autoComplete="email"
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                {...register("password")}
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="passwordRepeated">Repeat password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                {...register("passwordRepeated")}
                                placeholder="••••••"
                                type="password"
                                id="passwordRepeated"
                                autoComplete="new-passwordRepeated"
                                variant="outlined"
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleClick}
                        >
                            Sign up
                        </Button>
                    </Box>

                    <Popover
                        id={id}
                        open={submitError}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'left',
                        }}
                    >
                        <Typography sx={{p: 2}}>{submitErrorMessage}</Typography>
                    </Popover>

                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>or</Typography>
                    </Divider>

                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography sx={{textAlign: 'center'}}>
                            Already have an account?{' '}
                            <NavLink to="/login">Click me</NavLink>
                        </Typography>
                    </Box>

                </Card>
            </SignUpContainer>
        </AppTheme>);
}
