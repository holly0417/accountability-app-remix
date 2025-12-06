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
                        Your balance: { wallet.balance.toFixed(2) }
                    </Typography>
                </Stack>
            </Box>
        </Card>
    );
}
