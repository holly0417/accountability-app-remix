import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import React from "react";
import {useSubmit} from "react-router";
import type {PurchaseDto} from "~/components/dto/PurchaseDto";
import type {Page} from "~/components/pagination/Page";
import {WishlistAction} from "~/components/dto/WishlistAction";
import {PurchaseStatus} from "~/components/dto/PurchaseStatus";
import type {WalletDto} from "~/components/dto/WalletDto";
import Typography from "@mui/material/Typography";

interface PurchaseDataGridProps {
    data: Page<PurchaseDto>;
    wallet: WalletDto;
    title: string,
}

export default function PurchaseDataGrid({data, wallet, title}: PurchaseDataGridProps) {
    const row = data.content;
    const thisUserWalletBalance = wallet.balance;

    const buttonLabel = (status: PurchaseStatus, price: number) => {
        switch(status) {
            case PurchaseStatus.PURCHASED:
                return WishlistAction.DELETE;
            case PurchaseStatus.LISTED:
                if(price <= thisUserWalletBalance){
                    return WishlistAction.PURCHASE;
                } else {
                    return WishlistAction.OUT_OF_BUDGET;
                }
        }
    }
    const submit = useSubmit(); // 2. Get the submit function

    const handleAction = (id: string, action: WishlistAction) => {
        const formData = new FormData();
        formData.append('itemId', id);

        if (action == WishlistAction.PURCHASE) {
            formData.append('intent', WishlistAction.PURCHASE);
        } else {
            formData.append('intent', WishlistAction.DELETE);
        }

        submit(formData, { method: 'post' });
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'purchase id',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'description',
            headerName: 'description',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'price',
            headerName: 'price',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'status',
            headerName: 'status',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'purchaseTimeString',
            headerName: 'purchaseTimeString',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 0.5,
            minWidth: 150,
            renderCell: (params) => {
                const {id, price, status} = params.row

                const action = buttonLabel(status, price);

                if(action == WishlistAction.OUT_OF_BUDGET || action == WishlistAction.DELETE) {
                    return (
                        <Button
                            name="intent"
                            disabled={true}
                        >
                            {action}
                        </Button>
                    );
                }

                return (
                        <Button
                            value={action}
                            onClick={() => handleAction(id, action)}
                            name="intent"
                        >
                            {action}
                        </Button>
                );
            }
        },
    ];


    return (
        <>
        <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
            {title}
        </Typography>
            <DataGrid
                rows={row}
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
        </>

    );
}
