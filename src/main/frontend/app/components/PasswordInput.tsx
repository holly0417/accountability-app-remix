import * as React from 'react';
import {
    IconButton,
    InputAdornment, type TextFieldProps,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from "@mui/material/TextField";

interface PasswordInputProps extends Omit<TextFieldProps, 'variant'> {

}

const PasswordInput = React.forwardRef<HTMLDivElement, PasswordInputProps>((props, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (<>
        <TextField
            {...props}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>,
                },
            }}

        />

    </>);
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
