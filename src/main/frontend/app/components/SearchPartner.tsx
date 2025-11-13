import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {useLoaderData} from "react-router-dom";
import {clientLoader} from "~/routes/task";
import type {RelationshipDto} from "./dto/relationship/RelationshipDto";
import {relationshipData} from "~/composables/RelationshipData";
import {
    DataGrid, GridActionsCellItem,
    type GridActionsCellItemProps,
    type GridColDef,
    type GridRowId,
    type GridRowParams
} from "@mui/x-data-grid";
import type {TaskDataDto} from "~/components/dto/task/TaskDataDto";
import {useState} from "react";
import {taskData} from "~/composables/TaskData";
import {TaskStatus} from "~/components/dto/task/TaskStatus";
import {PlayArrow} from "@mui/icons-material";
import AlarmIcon from "@mui/icons-material/Alarm";
import DeleteIcon from "@mui/icons-material/Delete";
import type {RelationshipStatusDto} from "~/components/dto/relationship/RelationshipStatusDto";

export default function SearchPartner() {
    const {search} = relationshipData();
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    interface partnership{
        partner: string,
        status: RelationshipStatusDto,
        partnerId: number
    }

    const [rows, setRows] = React.useState<readonly partnership[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    React.useEffect(() => {
        if (inputValue === '') {
            setRows([]);
            return undefined; // Do nothing if the input is empty
        }

        setLoading(true);

        const fetchAndSetOptions = async () => {
            const newOptions = await search(inputValue);
            const partnershipList: partnership[] = newOptions.map((relationship) => {
                    const newItem: partnership = {
                        partner: relationship.partner.username,
                        status: relationship.status,
                        partnerId: relationship.partner.id,
                    }
                    return newItem;
                }
            );
            setRows(partnershipList);
            setLoading(false);
        };

        (async () => {
            await fetchAndSetOptions();
        })();
    }, [inputValue]); // This effect runs whenever the inputValue changes

    function getRowId(row:partnership) {
        return row.partnerId;
    }

    const columns: GridColDef[] = [
        {
            field: 'partner',
            headerName: 'partner username',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 0.5,
            minWidth: 150,
        },
    ];

    return (
        <div>
            <TextField
                value={inputValue}
                label="SearchPartner"
                onChange={handleSearchChange}
                slotProps={{
                    input: {
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            </React.Fragment>
                        ),
                    },
                }}
            />

            <DataGrid
                checkboxSelection
                rows={rows}
                getRowId={getRowId}
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
        </div>
    );
}
