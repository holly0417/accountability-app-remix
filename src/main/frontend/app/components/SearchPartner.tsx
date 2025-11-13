import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {useLoaderData} from "react-router-dom";
import {clientLoader} from "~/routes/task";
import type {RelationshipDto} from "./dto/relationship/RelationshipDto";
import {relationshipData} from "~/composables/RelationshipData";

export default function SearchPartner() {
    const {search} = relationshipData();
    const [options, setOptions] = React.useState<readonly RelationshipDto[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        if (inputValue === '') {
            setOptions([]);
            return undefined; // Do nothing if the input is empty
        }

        setLoading(true);

        const fetchAndSetOptions = async () => {
            const newOptions = await search(inputValue);
            setOptions(newOptions);
            setLoading(false);
        };

        (async () => {
            await fetchAndSetOptions();
        })();
    }, [inputValue]); // This effect runs whenever the inputValue changes

    return (
        <Autocomplete
            sx={{ width: 300 }}
            isOptionEqualToValue={(option, value) => option.partner === value.partner}
            getOptionLabel={(option) => option.partner.username}
            options={options}
            loading={loading}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="SearchPartner"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
