import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import React from "react";
import {useSubmit} from "react-router";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import type {Page} from "~/dto/pagination/Page";
import {WishlistAction} from "~/dto/purchase/WishlistAction";
import {PurchaseStatus} from "~/dto/purchase/PurchaseStatus";
import type {WalletDto} from "~/dto/WalletDto";
import Typography from "@mui/material/Typography";

interface PartnerWishlistGridProps {
    data: Page<PurchaseDto>;
    title: string,
}

export default function PartnerWishlistGrid({data, title}: PartnerWishlistGridProps) {
    const row = data.content;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'purchase id',
            flex: 0.5,
            minWidth: 80,
        },
        {
            field: 'userName',
            headerName: 'partner',
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
