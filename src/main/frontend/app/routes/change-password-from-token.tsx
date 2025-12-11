import {alpha} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '~/dashboard/ui/Dashboard/AppNavbar';
import Header from '~/dashboard/ui/Dashboard/Header';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import type {Route} from "./+types/change-password-from-token"; //this is OK!
import {
    chartsCustomizations, dataGridCustomizations, datePickersCustomizations, treeViewCustomizations,
} from '~/dashboard/ui/Dashboard/theme/customizations';
import {useNavigate, useSearchParams} from "react-router";
import Card from "@mui/material/Card";
import * as React from "react";
import {InputLabel} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import {useForm} from "react-hook-form";
import type {ResetPasswordDto} from "~/dto/user/ResetPasswordDto";
import {toast, Toaster} from "react-hot-toast";
import {useEmail} from "~/composables/EmailComposable";
import Button from "@mui/material/Button";
import type {GenericResponseDto} from "~/dto/GenericResponseDto";

const xThemeComponents = {
    ...chartsCustomizations, ...dataGridCustomizations, ...datePickersCustomizations, ...treeViewCustomizations,
};

export default function ChangePasswordFromToken({loaderData}: Route.ComponentProps) {
    let [searchParams] = useSearchParams();
    const {setNewPassword} = useEmail();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const {register, handleSubmit} = useForm({
        defaultValues: {
            password: '', passwordRepeated: '', token: token
        } as ResetPasswordDto
    });

    async function setPassword(data: ResetPasswordDto) {
        const response: GenericResponseDto = await setNewPassword(data);
        const message = response.message;

        toast(message, {
            duration: 2000,
        });

        if (!response.error) {

            setTimeout(() => navigate('/login'), 2000);
        } else {
            console.log(response);
        }
    }

    return (<AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex'}}>
                <AppNavbar user={loaderData.user}/>
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)` : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center', mx: 3, pb: 5, mt: {xs: 8, md: 0},
                        }}
                    >
                        <Header/>
                        <Toaster/>
                        <Card variant="outlined" sx={{maxWidth: 360}}>
                            <Box sx={{p: 2}} component="form">
                                <Stack
                                    direction="column"
                                    sx={{justifyContent: 'space-between', alignItems: 'center'}}
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
        </AppTheme>);
}
