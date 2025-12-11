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
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";

interface PurchaseDataGridProps {
    data: Page<PurchaseDto>;
    wallet: WalletDto;
    title: string,
}

export default function PurchaseDataGrid({data, wallet, title}: PurchaseDataGridProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isHistory = title == "PAST PURCHASES";

    const row = data.content;
    const thisUserWalletBalance = wallet.balance;

    const buttonLabel = (status: PurchaseStatus, price: number) => {
        switch (status) {
            case PurchaseStatus.PURCHASED:
                return WishlistAction.DELETE;
            case PurchaseStatus.LISTED:
                if (price <= thisUserWalletBalance) {
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

        submit(formData, {method: 'post'});
    };

    const columns: GridColDef[] = [{
        field: 'id', headerName: 'purchase id', flex: 0.5, minWidth: 80,
    }, {
        field: 'description', headerName: 'Item', flex: 0.5, minWidth: 80,
    }, {
        field: 'price', headerName: 'Price', flex: 0.5, minWidth: 80,
    }, {
        field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80,
    }, {
        field: 'purchaseTimeString', headerName: 'Timestamp', flex: 0.5, minWidth: 100,
    }, {
        field: 'actions', headerName: 'Action', flex: 0.5, minWidth: 100, renderCell: (params) => {
            const {id, price, status} = params.row

            const action = buttonLabel(status, price);

            if (action == WishlistAction.OUT_OF_BUDGET || action == WishlistAction.DELETE) {
                return (<Button
                        name="intent"
                        disabled={true}
                        variant="outlined"
                        size="small"
                    >{action}</Button>);
            }

            return (<Button
                    value={action}
                    onClick={() => handleAction(id, action)}
                    name="intent"
                    variant="outlined"
                    size="small"
                >{action}</Button>);
        }
    },];


    return (<>
        <Stack
            spacing={1}
            direction="column"
            sx={{
                alignItems: 'stretch', justifyContent: "flex-start", mx: 1, pb: 1, mt: {xs: 1, md: 0},
            }}>

            <Typography variant="h2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                {title}
            </Typography>
            <DataGrid
                rows={row}
                columns={columns}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
                initialState={{
                    pagination: {paginationModel: {pageSize: 20}},
                }}
                pageSizeOptions={[10, 20, 50]}
                disableColumnResize
                density="compact"
                columnVisibilityModel={{
                    // Hide columns based on the isMobile boolean
                    id: false,             // Always hidden (example)
                    description: true,
                    price: true, // Hidden if mobile is true
                    status: !isMobile,
                    purchaseTimeString: isHistory,
                    actions: !isHistory,
                }}
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
        </Stack>
        </>

    );
}
