import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import React from "react";
import {Form} from "react-router";
import type {TaskDataDto} from "~/dto/task/TaskDataDto";
import {TaskStatus} from "~/dto/task/TaskStatus";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Tooltip} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import {gridGetRowsParamsSelector} from "@mui/x-data-grid/internals";

interface PartnerTaskDataGridProps {
    data: TaskDataDto[];
}

export default function PartnerTaskDataGrid({data}: PartnerTaskDataGridProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const row = data;

    const columns: GridColDef[] = [{
        field: 'id', headerName: 'task id', flex: 0.5, minWidth: 80,
    }, {
        field: 'userId', headerName: 'user', flex: 0.5, minWidth: 80,
    }, {
        field: 'userName', headerName: 'Name', flex: 0.5, minWidth: 80,
    }, {
        field: 'description', headerName: 'Task', flex: 0.5, minWidth: 80, renderCell: (params) => (
            <Tooltip title={`User: ${params.row.userName} | Status: ${params.row.status}`} arrow>
                {/* 2. We need a span/div here to catch the hover event */}
                <span style={{ cursor: 'pointer', width: '100%' }}>
                </span>
            </Tooltip>
        ),
    }, {
        field: 'durationString', headerName: 'Duration', flex: 0.5, minWidth: 80,
    }, {
        field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80,
    }, {
        field: 'actions', headerName: 'Approve', flex: 0.5, minWidth: 80, renderCell: (params) => {
            const {id, status} = params.row

            if (status == TaskStatus.COMPLETED) {
                return (<Form method="post">
                    <Button value="APPROVE"
                            name="intent"
                            type="submit"
                            variant="outlined"
                            size="small">APPROVE</Button>
                    <input type="hidden" id="taskId" name="taskId" value={id}/>
                </Form>);
            }
            return "";
        }
    }, {
        field: 'secondaction', headerName: 'Reject', flex: 0.5, minWidth: 80, renderCell: (params) => {
            const {id, status} = params.row

            if (status == TaskStatus.COMPLETED) {
                return (<Form method="post">
                    <Button value="REJECT" name="intent" type="submit">REJECT</Button>
                    <input type="hidden" id="taskId" name="taskId" value={id}/>
                </Form>);
            }
            return "";
        }
    },];

    return (<>
        <DataGrid
            rows={row}
            columns={columns}
            getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            initialState={{
                pagination: {paginationModel: {pageSize: 20}},
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            columnVisibilityModel={{
                // Hide columns based on the isMobile boolean
                id: false,             // Always hidden (example)
                userId: false,   // Always show
                userName: !isMobile,
                description: true,
                durationString: !isMobile, // Hidden if mobile is true
                status: !isMobile,
                actions: true,
                secondaction: true,
            }}
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined', size: 'small',
                        }, columnInputProps: {
                            variant: 'outlined', size: 'small', sx: {mt: 'auto'},
                        }, operatorInputProps: {
                            variant: 'outlined', size: 'small', sx: {mt: 'auto'},
                        }, valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined', size: 'small',
                            },
                        },
                    },
                },
            }}
        />

    </>
        );
}
