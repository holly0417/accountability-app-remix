import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import {useEmail} from '~/composables/EmailComposable';
import FormControl from "@mui/material/FormControl";
import {FormHelperText, InputLabel} from "@mui/material";
import {useForm} from "react-hook-form";
import type {RegisterUser} from "~/dto/user/RegisterUser";
import type {RequestReset} from "~/dto/RequestReset";
import {toast, Toaster} from "react-hot-toast";

interface ForgotPasswordProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  handleClose: () => void;
}

export default function ForgotPassword({ setOpen, open, handleClose }: ForgotPasswordProps) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            email: '',
        } as RequestReset
    });

    const [errors, setErrors] = React.useState('');
    const { sendEmailResetPassword } = useEmail();

    async function sendEmail(data: RequestReset){
        const response = await sendEmailResetPassword(data.email);
        toast(response.message);
        setOpen(false);
    }

  return (
      <div>
          <Toaster />
          <Dialog
              open={open}
              onClose={handleClose}
              slotProps={{
                  paper: {
                      component: 'form',
                      sx: { backgroundImage: 'none' },
                  },
              }}
          >
              <DialogTitle>Reset password</DialogTitle>
              <DialogContent
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
              >
                  <DialogContentText>
                      Enter your account&apos;s email address, and we&apos;ll send you a link to
                      reset your password.
                  </DialogContentText>

                  <FormControl variant="outlined">
                      <InputLabel htmlFor="email">Email Address</InputLabel>
                      <OutlinedInput
                          {...register("email")}
                          autoFocus
                          required
                          margin="dense"
                          id="email"
                          name="email"
                          label="Email address"
                          placeholder="Email address"
                          type="email"
                          fullWidth
                      />
                      <FormHelperText>{errors}</FormHelperText>
                  </FormControl>

              </DialogContent>
              <DialogActions sx={{ pb: 3, px: 3 }}>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button variant="contained" onClick={handleSubmit(sendEmail)}>
                      Continue
                  </Button>
              </DialogActions>
          </Dialog>
      </div>

  );
}
