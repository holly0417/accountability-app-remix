import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import React from "react";
import type {PurchaseDto} from "~/dto/purchase/PurchaseDto";
import type {Page} from "~/dto/pagination/Page";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface PartnerWishlistGridProps {
    data: Page<PurchaseDto>;
    title: string,
}

export default function PartnerWishlistGrid({data, title}: PartnerWishlistGridProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const row = data.content;

    const columns: GridColDef[] = [{
        field: 'id', headerName: 'purchase id', flex: 0.5, minWidth: 80,
    }, {
        field: 'userName', headerName: 'Name', flex: 0.5, minWidth: 80,
    }, {
        field: 'description', headerName: 'Item', flex: 0.5, minWidth: 80,
    }, {
        field: 'price', headerName: 'Price', flex: 0.5, minWidth: 80,
    }, {
        field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80,
    }, {
        field: 'purchaseTimeString', headerName: 'Timestamp', flex: 0.5, minWidth: 80,
    },];

    return (<>
            <Typography fontWeight="medium" sx={{flex: 1, mx: 0.5}}>
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
                columnVisibilityModel={{
                    // Hide columns based on the isMobile boolean
                    id: false,             // Always hidden (example)
                    userName: true,
                    description: true,
                    price: true, // Hidden if mobile is true
                    status: true,
                    purchaseTimeString: !isMobile,
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
        </>);
}
