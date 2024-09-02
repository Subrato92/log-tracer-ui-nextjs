"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-in'

const drawerWidth = 300;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));

export default function ApplicationDrawer(props: any) {
    const {applications, selectedApplicationService, setSelectedApplicationService, startDateTimeValue, setStartDateTimeValue, endDateTimeValue, setEndDateTimeValue} = props
    const [open, setOpen] = React.useState<number>(-1);
    

    const handleClick = (applicationId: number) => {
        setOpen(applicationId);
    };
    console.log(applications)    

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}
            > 
                <Box sx={{ overflow: 'auto', paddingTop: '80px' }}>
                    <Search sx={{ overflow: 'auto' }}>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}/>
                    </Search>
                    <Divider />
                    <Box sx={{maxWidth: '95%'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-in'}>
                            <DemoContainer components={['DateTimePicker']} sx={{maxWidth: '100%', fontSize: '5px', paddingX: '4px'}}>
                                <DateTimePicker 
                                    views={['year', 'day', 'hours', 'minutes', 'seconds']} 
                                    label="Start Date Time" value={startDateTimeValue}
                                    onChange={(newValue) => setStartDateTimeValue(newValue)} />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-in'}>
                            <DemoContainer components={['DateTimePicker']} sx={{maxWidth: '100%', fontSize: '5px', paddingX: '4px', paddingBottom: '6px'}}>
                                <DateTimePicker 
                                    views={['year', 'day', 'hours', 'minutes', 'seconds']} 
                                    label="End Date Time" value={endDateTimeValue}
                                    onChange={(newValue) => setEndDateTimeValue(newValue)} 
                                    sx={{fontSize:'5px', maxWidth: '100%', }}
                                    />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Box>
                    <Divider />
                    <List>
                        {applications?.map((application: Application) => {
                            return (
                                <React.Fragment key={application.id}>
                                    <ListItemButton key={application.id} onClick={() => handleClick(application.id)}>
                                        <ListItemIcon>
                                        <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={application.name} />
                                        {open == application.id ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse key={application.id} in={open == application.id} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {application?.services?.map((service: Service) => (
                                                <ListItemButton key={service.id} sx={{ pl: 4 }} onClick={() => setSelectedApplicationService(service.id)}>
                                                    <ListItemIcon>
                                                        {selectedApplicationService==service.id ? <CheckCircleIcon fontSize='medium'/> : <CheckCircleOutlineIcon fontSize='medium'/>}
                                                    </ListItemIcon>
                                                    <ListItemText primary={service.name} />
                                                </ListItemButton>))}
                                        </List>
                                    </Collapse>
                                </React.Fragment>
                            )
                        })}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
