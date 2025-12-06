import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import type {TransitionProps} from '@mui/material/transitions';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, type UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemLabel,
  TreeItemRoot,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import type {TreeViewBaseItem} from '@mui/x-tree-view/models';
import { useTheme } from '@mui/material/styles';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import {useChartRootRef} from "@mui/x-charts";
import {href, useNavigate} from "react-router";

type Color = 'blue' | 'green';

type ExtendedTreeItemProps = {
  color?: Color;
  id: string;
  label: string;
  path?: string;
};

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
    { id: '1', label: 'Your information', color: 'green',
        children: [
            {
                id: '1.1',
                label: 'Your tasks',
                color: 'blue',
                path: '/task'
            },
            {
                id: '1.2',
                label: 'Your wishlist',
                color: 'blue',
                path: '/purchases/listed'
            },
            {
                id: '1.3',
                label: 'Your past purchases',
                color: 'blue',
                path: '/purchases/purchased'
            },
        ]
    },
    { id: '2', label: 'Your partners', color: 'green',
        children: [
            {
                id: '2.1',
                label: 'All partners & search',
                color: 'blue',
                path: '/partners'
            },
            {
                id: '2.2',
                label: 'All partner tasks',
                color: 'blue',
                path: '/partner-task'
            },
            {
                id: '2.3',
                label: 'Partner wishlist items',
                color: 'blue',
                path: '/partner-purchases/listed'
            },
            {
                id: '2.4',
                label: 'Partner past purchases',
                color: 'blue',
                path: '/partner-purchases/purchased'
            },
        ]
    },
    {
        id: '3', label: 'Tasks', color: 'green',
        children: [
            {
                id: '3.1', label: 'Your Tasks', color: 'green',
                children: [
                    {
                        id: '3.1.1',
                        label: 'All your tasks',
                        color: 'blue', path: '/task'
                    },
                    {
                        id: '3.1.2',
                        label: 'Planned',
                        color: 'blue',
                        path: '/task/pending'
                    },
                    {
                        id: '3.1.3',
                        label: 'In-progress',
                        color: 'blue',
                        path: '/task/in-progress'
                    },
                    {
                        id: '3.1.4',
                        label: "Completed",
                        color: 'blue',
                        path: '/task/completed'
                    },
                    {
                        id: '3.1.5',
                        label: 'Approved',
                        color: 'blue',
                        path: '/task/approved'
                    },
                    {
                        id: '3.1.6',
                        label: 'Rejected',
                        color: 'blue',
                        path: '/task/rejected'
                    },
                ],
            },
            {
                id: '3.2', label: 'Partner Tasks', color: 'green',
                children: [
                    {
                        id: '3.2.1',
                        label: 'All partner tasks',
                        color: 'blue',
                        path: '/partner-task'
                    },
                    {
                        id: '3.2.2',
                        label: 'Planned partner tasks',
                        color: 'blue',
                        path: '/partner-task/pending'
                    },
                    {
                        id: '3.2.3',
                        label: 'In-progress partner tasks',
                        color: 'blue',
                        path: '/partner-task/in-progress'
                    },
                    {
                        id: '3.2.4',
                        label: "Completed partner tasks",
                        color: 'blue',
                        path: '/partner-task/completed'
                    },
                    {
                        id: '3.2.5',
                        label: 'Approved partner tasks',
                        color: 'blue',
                        path: '/partner-task/approved'
                    },
                    {
                        id: '3.2.6',
                        label: 'Rejected partner tasks',
                        color: 'blue',
                        path: '/partner-task/rejected'
                    },
                ],
            },
        ],
    },
    {
        id: '4', label: 'Wishlists', color: 'green',
        children: [
            {
                id: '4.1',
                label: 'Your wishlist',
                color: 'blue',
                path: '/purchases/listed'
            },
            {
                id: '4.2',
                label: 'Partner wishlist items',
                color: 'blue',
                path: '/partner-purchases/listed'
            },
        ]
    },
    {
        id: '5', label: 'Past purchases', color: 'green',
        children: [
            {
                id: '5.1',
                label: 'Your past purchases',
                color: 'blue',
                path: '/purchases/purchased'
            },
            {
                id: '5.2',
                label: 'Partner past purchases',
                color: 'blue',
                path: '/partner-purchases/purchased'
            },
        ]
    },
    {
        id: '6', label: 'Wallets', color: 'green',
        children: [
            {
                id: '6.1',
                label: 'Your wallet overview',
                color: 'blue',
                path: '/wallet-purchases'
            },
            {
                id: '6.2',
                label: 'Partner wallet overview',
                color: 'blue',
            },
        ]
    }
]

function DotIcon({ color }: { color: string }) {
  return (
    <Box sx={{ marginRight: 1, display: 'flex', alignItems: 'center' }}>
      <svg width={6} height={6}>
        <circle cx={3} cy={3} r={3} fill={color} />
      </svg>
    </Box>
  );
}

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

interface CustomLabelProps {
  children: React.ReactNode;
  color?: Color;
  expandable?: boolean;
}

function CustomLabel({ color, expandable, children, ...other }: CustomLabelProps) {
  const theme = useTheme();
  const colors = {
    blue: (theme.vars || theme).palette.primary.main,
    green: (theme.vars || theme).palette.success.main,
  };

  const iconColor = color ? colors[color] : null;
  return (
    <TreeItemLabel {...other} sx={{ display: 'flex', alignItems: 'center' }}>
      {iconColor && <DotIcon color={iconColor} />}
      <Typography
        className="labelText"
        variant="body2"
        sx={{ color: 'text.primary' }}
      >
        {children}
      </Typography>
    </TreeItemLabel>
  );
}

interface CustomTreeItemProps
  extends Omit<UseTreeItemParameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
    path?: string;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, path, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const color = item?.color;
  return (
    <TreeItemProvider id={id} itemId={itemId}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent
          {...getContentProps({
            className: clsx('content', {
              expanded: status.expanded,
              selected: status.selected,
              focused: status.focused,
              disabled: status.disabled,
            }),
          })}
        >
          {status.expandable && (
            <TreeItemIconContainer {...getIconContainerProps()}>
              <TreeItemIcon status={status}/>
            </TreeItemIconContainer>
          )}

          <CustomLabel {...getLabelProps({ color })} />

        </TreeItemContent>
        {children && (
          <TransitionComponent
            {...getGroupTransitionProps({ className: 'groupTransition' })}
          />
        )}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

// @ts-ignore
export const findItemById = (items: TreeViewBaseItem<ExtendedTreeItemProps>[], id: string) => {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
            const found: ExtendedTreeItemProps | null = findItemById(item.children, id);
            if (found) return found;
        }
    }
    return null;
};

export default function CustomizedTreeView() {
    const navigate = useNavigate();

    const handleItemClick = (event: React.MouseEvent, itemId: string) => {
        // Prevent default behavior if needed (though usually not necessary for RichTreeView)

        // Find the item data based on the ID
        const item = findItemById(ITEMS, itemId);

        // Only navigate if the item has a path defined
        if (item && item.path) {
            navigate(item.path);
        }
    };

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Accountability App
        </Typography>
        <RichTreeView
          items={ITEMS}
          aria-label="pages"
          multiSelect
          sx={{
            m: '0 -8px',
            pb: '8px',
            height: 'fit-content',
            flexGrow: 1,
            overflowY: 'auto',
          }}
          slots={{ item: CustomTreeItem }}
          onItemClick={handleItemClick}
        />
      </CardContent>
    </Card>
  );
}
