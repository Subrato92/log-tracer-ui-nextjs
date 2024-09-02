"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation'

const pages = [['Home', "/"], ['Logs', '/view']];

export default function TopNavBar() {
    const router = useRouter()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }, marginRight: '35px',  marginY: 'auto' }}
                    >
                        WELLS FARGO - LogTracer
                    </Typography>
                    <Box sx={{flexFlow: 'row flex-wrap', display: 'flex', marginY: 'auto'}}>
                        {pages.map((page, idx) => (
                        <Button
                            key={idx}
                            onClick={() => router.push(page[1])}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page[0]}
                        </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

