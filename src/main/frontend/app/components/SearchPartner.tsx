import * as React from 'react';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {relationshipData} from "~/composables/RelationshipData";
import {
    DataGrid,
    type GridColDef,
} from "@mui/x-data-grid";
import type {RelationshipStatusDto} from "~/components/dto/relationship/RelationshipStatusDto";
import Button from "@mui/material/Button";
import {RelationshipStatus} from "~/components/dto/relationship/RelationshipStatus";
import {useSubmit} from "react-router";

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

    const buttonLabel = (value: RelationshipStatus) => {

        switch(value) {
            case RelationshipStatus.PENDING:
            case RelationshipStatus.APPROVED:
            case RelationshipStatus.REJECTED:
            case RelationshipStatus.REQUESTED:
                return true;
            default:
                return false;
        }

    }
    const submit = useSubmit(); // 2. Get the submit function

    const sendRequest = (id: number, status: RelationshipStatus) => {

        const partnerId = id.toString();

        if(status != null){
            return;
        }

        const SendPartnershipRequest = new FormData();
        SendPartnershipRequest.append('id', partnerId);
        SendPartnershipRequest.append('intent', "REQUEST");
        // 4. Programmatically submit the data to the action
        submit(SendPartnershipRequest, { method: 'post' });
    };

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
            renderCell: (params) => {
                const {partnerId, status} = params.row

                const action = buttonLabel(status);

                return (
                    <Button
                        onClick={() => sendRequest(partnerId, status)}
                        name="intent"
                        disabled={action}
                    >
                        SEND REQUEST
                    </Button>
                );
            }
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
