import * as React from 'react';
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import type {WalletDto} from "~/dto/WalletDto";

interface WalletProps {
    wallet: WalletDto;
}

export default function Wallet({wallet}: WalletProps) {

    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
            <Box sx={{ p: 2 }}>
                <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        Wallet
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        { wallet.balance.toFixed(2) }
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Pinstriped cornflower blue cotton blouse takes you on a walk to the park or
                    just down the hall.
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography gutterBottom variant="body2">
                    Select type
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Chip color="primary" label="Soft" size="small" />
                    <Chip label="Medium" size="small" />
                    <Chip label="Hard" size="small" />
                </Stack>
            </Box>
        </Card>
    );
}
