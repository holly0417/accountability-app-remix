import {useFetcher} from "react-router";
import {useEffect, useRef} from "react";
import {WishlistAction} from "~/dto/purchase/WishlistAction";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


export default function PurchaseForm() {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);

    const isSubmitting = fetcher.state === "submitting";

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            formRef.current?.reset();
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <div>
            <Card variant="outlined" sx={{ maxWidth: 360 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                    Add to your wishlist here
                </Typography>
            <fetcher.Form method="post" ref={formRef}>
                <TextField
                    id="newPurchaseDescription"
                    type="text"
                    name="newPurchaseDescription"
                    required
                    label="What do you want to buy?"
                    disabled={isSubmitting}
                    variant="filled"
                />
                <TextField
                    id="newPurchasePrice"
                    type="number"
                    name="newPurchasePrice"
                    label="How much?"
                    required
                    disabled={isSubmitting}
                    variant="filled"
                />

                <Button
                    type="submit"
                    name="intent"
                    variant="contained"
                    value = {WishlistAction.ADD}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending..." : "Submit"}
                </Button>

            </fetcher.Form>
            </Card>
        </div>
    );
}