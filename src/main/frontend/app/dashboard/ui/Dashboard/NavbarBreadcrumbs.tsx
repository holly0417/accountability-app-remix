import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));


import { useMatches, Link as RouterLink } from "react-router";
import { Link } from "@mui/material";

export default function NavbarBreadcrumbs() {
    // 1. Get all active routes (e.g., Root -> Users -> UserDetail)
    const matches = useMatches();

    // 2. Filter out routes that don't have a breadcrumb handle
    const crumbs = matches
        .filter((match) => match.handle && (match.handle as any).breadcrumb)
        .map((match) => {
            const { handle, pathname } = match;

            // 3. Resolve the label. Is it a string or a function?
            const handleData = handle as { breadcrumb: string | (() => string) };

            const label = typeof handleData.breadcrumb === "function"
                ? handleData.breadcrumb() // Pass loader data to function
                : handleData.breadcrumb;

            return {
                path: pathname,
                label: label,
            };
        });

    return (
        <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRoundedIcon fontSize="small" />}>
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
                Home
            </Link>

            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                return isLast ? (
                    // Last item is text (not clickable)
                    <Typography key={crumb.path} color="text.primary">
                        {crumb.label}
                    </Typography>
                ) : (
                    // Middle items are links
                    <Link
                        key={crumb.path}
                        component={RouterLink}
                        to={crumb.path}
                        underline="hover"
                        color="inherit"
                    >
                        {crumb.label}
                    </Link>
                );
            })}
        </StyledBreadcrumbs>
    );
}