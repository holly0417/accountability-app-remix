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
import {AccountabilityIcon, SitemarkIcon} from '~/dashboard/ui/SignIn/CustomIcons';
import {NavLink} from "react-router";
import Popover from '@mui/material/Popover';
import axios from 'axios';
import type {RegisterUser} from "~/dto/user/RegisterUser";
import {useForm} from 'react-hook-form';
import {useConstraintViolations} from "~/composables/ConstraintViolations";
import type {ConstraintViolation} from "~/dto/ConstraintViolation";
import {InputLabel} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import PasswordInput from "~/components/PasswordInput";
import {toast, Toaster} from "react-hot-toast";

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
    minHeight: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    width: '100%',
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

    const [validationErrors, setValidationErrors] = React.useState<ConstraintViolation[]>([]);

    const { hasError, removeFieldError, getMessageElements } = useConstraintViolations();

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

    const api = axios.create({
        baseURL: '/', headers: {'Content-Type': 'application/json',}, maxRedirects: 0
    });

    const onSubmit = async (data: RegisterUser) => {
        await api.post<any>('/registration', data)
            .then(response => {
                console.log(response);

                if (response.status && response.status === 200) {

                    toast("Registration successful", {
                        duration: 1000,
                    });

                    setTimeout(() => window.location.href = response.headers['Location'], 1500);
                }

            })
            .catch((error) => {
                if (error.response) {
                    setValidationErrors(error.response.data.violations);
                } else if (error.request) {
                    // The request was made but no response was received (possible network error)
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    if (error.request){
                        setSubmitErrorMessage(error.request);
                    }
                    // Something happened in setting up the request that triggered an Error
                    setSubmitErrorMessage(error.message);
                    setSubmitError(true);
                }
            });
    };

    return (<AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <Toaster/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <AccountabilityIcon/>
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
                                error={hasError("username", validationErrors)}
                                helperText={getMessageElements("username", validationErrors)}
                                color={hasError("username", validationErrors) ? 'error' : 'primary'}
                                onChange={ () => setValidationErrors(removeFieldError('username', validationErrors)) }
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
                                error={hasError("name", validationErrors)}
                                helperText={getMessageElements("name", validationErrors)}
                                color={hasError("name", validationErrors) ? 'error' : 'primary'}
                                onChange={ () => setValidationErrors(removeFieldError('name', validationErrors)) }
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
                                error={hasError("email", validationErrors)}
                                helperText={getMessageElements("email", validationErrors)}
                                color={hasError("email", validationErrors) ? 'error' : 'primary'}
                                onChange={ () => setValidationErrors(removeFieldError('email', validationErrors)) }
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <PasswordInput
                                id="password"
                                {...register("password")}
                                placeholder="••••••"
                                error={hasError("password", validationErrors)}
                                helperText={getMessageElements("password", validationErrors)}
                                color={hasError("password", validationErrors) ? 'error' : 'primary'}
                                onChange={() => setValidationErrors(removeFieldError('password', validationErrors))}
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
                                error={hasError("passwordRepeated", validationErrors)}
                                helperText={getMessageElements("passwordRepeated", validationErrors)}
                                color={hasError("passwordRepeated", validationErrors) ? 'error' : 'primary'}
                                onChange={ () => setValidationErrors(removeFieldError('passwordRepeated', validationErrors)) }
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
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Typography sx={{ p: 2 }}>{submitErrorMessage}</Typography>
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
