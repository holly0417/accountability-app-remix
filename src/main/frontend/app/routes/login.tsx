//template taken from free examples in material UI library

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import ForgotPassword from '~/dashboard/ui/SignIn/ForgotPassword';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import ColorModeSelect from '~/dashboard/shared-theme/ColorModeSelect';
import {NavLink, useNavigate} from "react-router";
import {api} from "~/axios";
import {type AxiosError} from "axios";
import {useForm} from 'react-hook-form';
import type {LoginDto} from "~/dto/user/LoginDto";
import AppIcon from "~/img/app_icon.jpg";
import Avatar from "@mui/material/Avatar";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px', ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({theme}) => ({
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

export default function Login(props: { disableCustomTheme?: boolean }) {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            username: '', password: '',
        } as LoginDto
    });

    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (data: LoginDto) => {
        const formData = new URLSearchParams() //javascript object that encodes
        // way of sending form to backend, only needed for the login
        // this is data similar to JSON, but the format of the request is of content-type application/x-www-form-urlencoded
        //handler in the backend does not accept JSON because we're using Spring Form Authentication
        formData.append('username', data.username)
        formData.append('password', data.password)

        api.post('/login', formData)
            .then(() => navigate('/'))
            .catch((err: AxiosError) => {
                console.log(err);

                if (err.response?.status === 401) {
                    alert("Login failed. Please double check you're using the correct credentials for your account.")
                }
            })

    };


    return (<AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <SignInContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
                <Card variant="outlined">
                    <Avatar
                        sizes="medium"
                        alt="Holly's Accountability App"
                        src={AppIcon}
                        sx={{width: 100, height: 100}}
                    />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{
                            display: 'flex', flexDirection: 'column', width: '100%', gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <TextField
                                id="username"
                                type="username"
                                {...register("username")}
                                placeholder="your username"
                                autoComplete="username"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color='primary'
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                {...register("password")}
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color='primary'
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <ForgotPassword open={open} setOpen={setOpen} handleClose={handleClose}/>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            Sign in
                        </Button>

                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{alignSelf: 'center'}}
                        >
                            Forgot your password?
                        </Link>
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Typography sx={{textAlign: 'center'}}>
                            Don&apos;t have an account?{' '}
                            <NavLink to="/registration">Click me</NavLink>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </AppTheme>);
}
