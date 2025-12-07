import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '~/dashboard/ui/Dashboard/AppNavbar';
import Header from '~/dashboard/ui/Dashboard/Header';
import SideMenu from '~/dashboard/ui/Dashboard/SideMenu';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import type {Route} from "./+types/change-password-from-token"; //this is OK!

import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '~/dashboard/ui/Dashboard/theme/customizations';
import {data, Link, redirect, useNavigate, useSearchParams} from "react-router";
import {userData} from "~/composables/UserData";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {FormHelperText, InputLabel} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import {useForm} from "react-hook-form";
import type {RequestReset} from "~/dto/RequestReset";
import type {ResetPasswordDto} from "~/dto/user/ResetPasswordDto";
import {toast, Toaster} from "react-hot-toast";
import {useEmail} from "~/composables/EmailComposable";
import Button from "@mui/material/Button";
import type {AxiosError} from "axios";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

interface ErrorMessageSet {
    password: string,
    passwordRepeated: string
}

export default function ChangePasswordFromToken({loaderData}: Route.ComponentProps) {
    let [searchParams] = useSearchParams();
    const {setNewPassword} = useEmail();
    const token = searchParams.get("token");
    const [confirmation, setConfirmation] = React.useState('');
    const [passwordMessage, setPasswordMessage] = React.useState('');
    const [passwordRepeatedMessage, setPasswordRepeatedMessage] = React.useState('');
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            password: '',
            passwordRepeated: '',
            token: token
        } as ResetPasswordDto
    });

    const [errorMessages, setErrorMessages] = React.useState(
        {
            password: '',
            passwordRepeated: ''
        } as Record<string, string>
    );

    async function setPassword(data: ResetPasswordDto){
        try {

            const response = await setNewPassword(data);
            setConfirmation(response);

            toast(response, {
                duration: 2000,
            });

            setTimeout(() => navigate('/login'), 2000);

        } catch (error: AxiosError) {

            if (error.response.data.errors) {

                const errorSet: Record<string, string> = {
                    password: '',
                    passwordRepeated: ''
                }

                Object.entries(error.response.data.errors).forEach(([field, message]) => {
                    if (field in errorMessages) {
                        errorSet[field] = message as string;
                    }
                });

                setErrorMessages(errorSet)
            }
            console.log(error);
        }
    }

    return (
        <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <AppNavbar />
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Header />
                        <Toaster />
                        <Card variant="outlined" sx={{ maxWidth: 360 }}>
                            <Box sx={{ p: 2 }} component="form">
                                <Stack
                                    direction="column"
                                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="password">New Password</InputLabel>
                                        <OutlinedInput
                                            {...register("password")}
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="password"
                                            name="password"
                                            label="New password"
                                            type="password"
                                            fullWidth
                                        />
                                    </FormControl>
                                    <FormHelperText>{errorMessages.password}</FormHelperText>

                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="email">New Password Repeated</InputLabel>
                                        <OutlinedInput
                                            {...register("passwordRepeated")}
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="passwordRepeated"
                                            name="passwordRepeated"
                                            label="New password repeated"
                                            type="password"
                                            fullWidth
                                        />
                                        <FormHelperText>{errorMessages.passwordRepeated}</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" onClick={handleSubmit(setPassword)}>
                                        Continue
                                    </Button>
                                </Stack>
                            </Box>
                        </Card>

                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
