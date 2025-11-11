//template taken from free examples in material UI library

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../components/shared-theme/AppTheme';
import ColorModeSelect from '../components/shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '~/components/ui/SignIn/CustomIcons';
import { NavLink } from "react-router";
import Popover from '@mui/material/Popover';
import axios from 'axios';
import type {RegisterUser} from "~/components/dto/RegisterUser";
import { useForm } from 'react-hook-form';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function Registration(props: { disableCustomTheme?: boolean }) {
    //RegisterUser info
    const { register, handleSubmit } = useForm({
        defaultValues: {
        username: '',
        name: '',
        email: '',
        password: '',
        passwordRepeated: '',
        } as RegisterUser
    });

    //error messages for frontend simple validation
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [passwordRepeatedError, setPasswordRepeatedError] = React.useState(false);
    const [passwordRepeatedErrorMessage, setPasswordRepeatedErrorMessage] = React.useState('');

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
    };

    //simple frontend validation before submitting
    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        return isValid;
    };

    const onSubmit = (data: RegisterUser) => {

        const api = axios.create({
            baseURL: '/',
            headers: { 'Content-Type': 'application/json', },
            maxRedirects: 0
        });

        api.post<RegisterUser>('/registration', data)
            .then(response => {
                if (response.headers['Content-Type'] !== 'application/json') {
                    window.location.href = response.headers['Location']
                }
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                setSubmitError(true);
                setSubmitErrorMessage(error);
            })

    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Username</FormLabel>
                            <TextField
                                autoComplete="username"
                                {...register("username")}
                                required
                                fullWidth
                                id="username"
                                placeholder="JonSnow45"
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                color={usernameError ? 'error' : 'primary'}
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
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
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
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
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
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
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
                                error={passwordRepeatedError}
                                helperText={passwordRepeatedErrorMessage}
                                color={passwordRepeatedError ? 'error' : 'primary'}
                                onChange={validateInputs}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive updates via email."
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleClick}
                        >
                            Sign up
                        </Button>

                        <Popover
                            id={id}
                            open={submitError}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Typography sx={{ p: 2 }}>{submitErrorMessage}</Typography>
                        </Popover>

                    </Box>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign up with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon />}
                        >
                            Sign up with Facebook
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <NavLink to="/login">Click me</NavLink>
                        </Typography>
                    </Box>

                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}
