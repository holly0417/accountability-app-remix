import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import React from "react";
import {useSubmit} from "react-router";
import {RelationshipStatus} from "~/components/dto/relationship/RelationshipStatus";
import {RelationshipAction} from "~/components/dto/relationship/RelationshipAction";
import Button from "@mui/material/Button";
import type {UserDto} from "~/components/dto/UserDto";
import type {Page} from "~/components/pagination/Page";
import type {RelationshipDto} from "~/components/dto/relationship/RelationshipDto";

type PartnerDataGridProps = {
    listType: string;
    friends: Page<RelationshipDto>;
    currentUser: UserDto;
};

export default function PartnerDataGrid({listType, friends, currentUser}: PartnerDataGridProps) {
    const row = friends;

    const submit = useSubmit(); // 2. Get the submit function

    const checkIdDoesNotMatchCurrentUserId = (value: number) => {
        return value != currentUser.id;
    }

    const checkButtonOptions = () => {
        if(listType == "answer"){
            return "APPROVE";
        }
        return "DELETE";
    }

    const checkSecondButtonOptions = () => {
        if(listType == "answer"){
            return "REJECT";
        }
        return "";
    }

    const relationshipHandler = (relationshipId: number, intent: string) => {
        const handlePartner = new FormData();
        handlePartner.append('id', relationshipId.toString());

        if (intent == "APPROVE"){
            handlePartner.append('intent', RelationshipAction.APPROVE);
        } else if (intent == "DELETE"){
            handlePartner.append('intent', RelationshipAction.DELETE);
        }
        // 4. Programmatically submit the data to the action
        submit(handlePartner, { method: 'post' });
    };

    const rejectionHandler = (relationshipId: number, intent: string) => {
        const handleRejection = new FormData();
        handleRejection.append('id', relationshipId.toString());

        if (intent == "REJECT"){
            handleRejection.append('intent', RelationshipAction.REJECT);
        }

        // 4. Programmatically submit the data to the action
        submit(handleRejection, { method: 'post' });
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
                const userId = user.id;
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
                const {id} = params.row
                const option = checkButtonOptions();
                return (<Button value={option}
                                onClick={() => relationshipHandler(id, option)}
                                name="intent">{option}</Button>);
            }
        },
        {
            field: 'second-action',
            headerName: 'More Actions',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {id} = params.row
                const option = checkSecondButtonOptions();
                if(option=="REJECT"){
                    return (<Button value={option}
                                    onClick={() => rejectionHandler(id, option)} //gets confused about intent from having 2 buttons at once
                                    name="intent">{option}</Button>);
                }
                return (<Button>{option}</Button>);
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
