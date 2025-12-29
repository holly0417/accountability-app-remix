import * as React from 'react';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {relationshipData} from "~/composables/RelationshipData";
import {DataGrid, type GridColDef,} from "@mui/x-data-grid";
import type {RelationshipStatusDto} from "~/dto/relationship/RelationshipStatusDto";
import Button from "@mui/material/Button";
import {RelationshipStatus} from "~/dto/relationship/RelationshipStatus";
import {Form} from "react-router";
import {RelationshipAction} from "~/dto/relationship/RelationshipAction";
import Collapse from "@mui/material/Collapse";


interface partnership {
    partner: string,
    status: RelationshipStatusDto,
    partnerId: number
}

export default function SearchPartner() {
    const {search} = relationshipData();
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

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
            });
            setRows(partnershipList);
            setLoading(false);
        };

        (async () => {
            await fetchAndSetOptions();
        })();
    }, [inputValue]); // This effect runs whenever the inputValue changes


    function getRowId(row: partnership) {
        return row.partnerId;
    }

    const columns: GridColDef[] = [{
        field: 'partner', headerName: 'partner username', flex: 0.5, minWidth: 80,
    }, {
        field: 'actions', headerName: 'Action', flex: 0.5, minWidth: 150, renderCell: (params) => {
            const {partnerId, status} = params.row

            const buttonLabel = (value: RelationshipStatus) => {
                switch (value) {
                    case RelationshipStatus.PENDING:
                    case RelationshipStatus.APPROVED:
                    case RelationshipStatus.REJECTED:
                        return true;
                    default:
                        return false;
                }
            }

            const action = buttonLabel(status);

            return (<Form method="post">
                    <Button
                        name="intent"
                        disabled={action}
                        value={RelationshipAction.REQUEST}
                        type="submit"
                    >
                        SEND REQUEST
                    </Button>
                    <input type="hidden" id="id" name="id" value={partnerId}/>
                </Form>

            );
        }
    },];

    return (<div>
            <TextField
                value={inputValue}
                label="Type to search for a partner"
                onChange={handleSearchChange}
                variant="standard"
                slotProps={{
                    input: {
                        endAdornment: (<React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                            </React.Fragment>),
                    },
                }}
            />
            <Collapse in={rows.length > 0}>
                <DataGrid
                    rows={rows}
                    getRowId={getRowId}
                    columns={columns}
                    getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
                    initialState={{
                        pagination: {paginationModel: {pageSize: 20}},
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    disableColumnResize
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
            </Collapse>

        </div>);
}
