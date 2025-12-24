import {alpha} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from '~/dashboard/ui/Dashboard/Header';
import AppTheme from '~/dashboard/shared-theme/AppTheme';
import type {Route} from "./+types/change-password-from-token"; //this is OK!
import {
    chartsCustomizations, dataGridCustomizations, datePickersCustomizations, treeViewCustomizations,
} from '~/dashboard/ui/Dashboard/theme/customizations';
import {useNavigate, useSearchParams} from "react-router";
import Card from "@mui/material/Card";
import * as React from "react";
import FormControl from "@mui/material/FormControl";
import {useForm} from "react-hook-form";
import type {ResetPasswordDto} from "~/dto/user/ResetPasswordDto";
import {toast, Toaster} from "react-hot-toast";
import {useEmail} from "~/composables/EmailComposable";
import Button from "@mui/material/Button";
import PasswordInput from "~/components/PasswordInput";
import FormLabel from "@mui/material/FormLabel";
import type {ConstraintViolation} from "~/dto/ConstraintViolation";
import {useConstraintViolations} from "~/composables/ConstraintViolations";

const xThemeComponents = {
    ...chartsCustomizations, ...dataGridCustomizations, ...datePickersCustomizations, ...treeViewCustomizations,
};

export default function ChangePasswordFromToken() {
    let [searchParams] = useSearchParams();
    const {setNewPassword} = useEmail();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const {register, handleSubmit} = useForm({
        defaultValues: {
            password: '', passwordRepeated: '', token: token
        } as ResetPasswordDto
    });
    const [validationErrors, setValidationErrors] = React.useState<ConstraintViolation[]>([]);

    const { hasError, removeFieldError, getMessageElements } = useConstraintViolations();

    async function setPassword(data: ResetPasswordDto) {
        await setNewPassword(data).then(response => {
            const message = response.message;

            toast(message, {
                duration: 2000,
            });

            if (!response.error) {
                setTimeout(() => navigate('/login'), 2000);
            } else {
                console.log(response);
            }
        })
        .catch((error) => {
            if (error.response) {
                setValidationErrors(error.response.data.violations);
            } else if (error.request) {
                // The request was made but no response was received (possible network error)
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error);
            }
        });

    }

    return (<AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex'}}>
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
                                        <FormLabel htmlFor="password">New Password</FormLabel>
                                        <PasswordInput
                                            {...register("password")}
                                            autoFocus
                                            required
                                            margin="dense"
                                            placeholder="••••••"
                                            fullWidth
                                            error={hasError("password", validationErrors)}
                                            helperText={getMessageElements("password", validationErrors)}
                                            color={hasError("password", validationErrors) ? 'error' : 'primary'}
                                            onChange={() => setValidationErrors(removeFieldError('password', validationErrors))}
                                        />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <FormLabel htmlFor="email">New Password Repeated</FormLabel>
                                        <PasswordInput
                                            {...register("passwordRepeated")}
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="passwordRepeated"
                                            fullWidth
                                            error={hasError("passwordRepeated", validationErrors)}
                                            helperText={getMessageElements("passwordRepeated", validationErrors)}
                                            color={hasError("passwordRepeated", validationErrors) ? 'error' : 'primary'}
                                            onChange={ () => setValidationErrors(removeFieldError('passwordRepeated', validationErrors)) }
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
