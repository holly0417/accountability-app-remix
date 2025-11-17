import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {clientLoader} from "~/routes/partner-tasks";
import {useLoaderData} from "react-router-dom";
import React from "react";
import {useSubmit} from "react-router";
import {RelationshipStatus} from "~/components/dto/relationship/RelationshipStatus";
import {RelationshipAction} from "~/components/dto/relationship/RelationshipAction";
import {userData} from "~/composables/UserData";
import Button from "@mui/material/Button";
import type {UserDto} from "~/components/dto/UserDto";
import type {Page} from "~/components/pagination/Page";
import type {RelationshipDto} from "~/components/dto/relationship/RelationshipDto";
import {useRouteLoaderData} from "react-router-dom";

export default function PartnerDataGrid() {
    const {answerList, waitList, rejectList, approveList, user, userId, userName, userEmail} = useLoaderData<typeof clientLoader>();

    const row = answerList;

    if (user) {
        console.log("The user exists:", userId, userName, userEmail);
    } else {
        console.log("didn't work", userId, userName, userEmail);
    }

    const submit = useSubmit(); // 2. Get the submit function

    const checkIdDoesNotMatchCurrentUserId = (value: number) => {
            return value != userId;
    }

    const checkButtonOptions = (userId: number, status: RelationshipStatus) => {
        if(status === RelationshipStatus.PENDING){
            if(checkIdDoesNotMatchCurrentUserId(userId)){
                return (<Button disabled> WAIT FOR RESPONSE </Button>);
            }
            return (<Button value="approve" name="intent"> APPROVE </Button>);
        }
        return (<Button value="delete" name="intent"> DELETE </Button>);
    }

    const checkSecondButtonOptions = (userId: number, status: RelationshipStatus) => {
        if(status === RelationshipStatus.PENDING){
            if(!checkIdDoesNotMatchCurrentUserId(userId)){
                return (<Button value="reject" name="intent"> REJECT </Button>);
            }
        }
        return ("");
    }

    const approvePartner = (id: string, status: RelationshipStatus) => {
        const answerPartner = new FormData();
        answerPartner.append('id', id);

        if(status === RelationshipStatus.PENDING){
            answerPartner.append('intent', RelationshipAction.APPROVE);
        }
        // 4. Programmatically submit the data to the action
        submit(answerPartner, { method: 'post' });
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'relationship id',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'username',
            headerName: 'username',
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => {
                const {partner, user} = params.row
                const userId = params.row.user.id;
                if(checkIdDoesNotMatchCurrentUserId(userId)){
                    return user.username;
                } else {
                    return partner.username;
                }
            }
        },
        {
            field: 'status',
            headerName: 'status',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {user, status} = params.row
                return checkButtonOptions(user.id, status);
            }
        },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {user, status} = params.row
                return checkSecondButtonOptions(user.id, status);
            }
        },
    ];


    return (
        <DataGrid
            checkboxSelection
            rows={row.content}
            columns={columns}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
            }}
        />
    );
}
