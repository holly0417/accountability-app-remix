import {useFetcher} from "react-router";
import {TaskAction} from "~/dto/task/TaskAction";
import {useEffect, useRef} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";


export default function TaskForm() {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);

    const isSubmitting = fetcher.state === "submitting";

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            formRef.current?.reset();
        }
    }, [fetcher.state, fetcher.data]);

    return (<div>
            <Box sx={{mr: 'auto'}}>
                <fetcher.Form method="post" ref={formRef}>
                    <Stack spacing={2} direction="row" sx={{alignItems: 'center', borderColor: 'divider'}}>
                        <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                            Add new task here
                        </Typography>
                        <TextField
                            required
                            id="filled-required"
                            label="My new task"
                            name="newTaskDescription"
                            disabled={isSubmitting}
                            variant="filled"
                        />
                        <Button
                            type="submit"
                            name="intent"
                            variant="contained"
                            value={TaskAction.ADD}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Submit"}
                        </Button>
                    </Stack>
                </fetcher.Form>
            </Box>

        </div>);
}