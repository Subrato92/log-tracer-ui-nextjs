"use client"
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Typography } from '@mui/material';
import * as React from 'react';
import Grid from '@mui/material/Grid2';
import WorkIcon from '@mui/icons-material/Work';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

enum NewApplicationAction {
  SET_APPLICATION_NAME,
  SET_SERVICE_COUNT,
  SET_SERVICE_NAME,
  SET_SERVICE_DESCRIPTION,
  SET_SERVICE_PATH,
  RESET
}

const as_reducer = (state: NewApplicationState, action: any) => {
  let newState:NewApplicationState = {...state}

  if(state.services){
    newState['services'] = state.services.map((service) => {
      if(service)
        return {...service}
      return { name: '', description:'', source_path: ''}
    })
  }else{
    newState['services'] = []
  }

  if (action.type === NewApplicationAction.SET_APPLICATION_NAME) {
    newState['name'] = action.value;
  }else if (action.type === NewApplicationAction.SET_SERVICE_COUNT && action.value > 0) {
    newState['service_count'] = action.value;

    while(newState.services.length < action.value){
      newState.services.push({ name: '', description:'', source_path: ''})
    }

    while(newState.services.length > action.value){
      newState.services.pop()
    }
  }else if (action.type === NewApplicationAction.SET_SERVICE_NAME) {
    newState.services[action.index].name = action.value;
  }else if (action.type === NewApplicationAction.SET_SERVICE_DESCRIPTION) {
    newState.services[action.index].description = action.value;
  }else if (action.type === NewApplicationAction.SET_SERVICE_PATH) {
    newState.services[action.index].source_path = action.value;
  }else if (action.type === NewApplicationAction.RESET) {
    newState = {...as_initial_state};
  }

  return newState;
}

const as_initial_state : NewApplicationState = {
  name: '',
  service_count: 1,
  services: [{
    name: '',
    description: '',
    source_path: ''
  }]
}

const getIndxes = (count: number) => {
  let list = []
  while(list.length < count){
    list.push(list.length)
  }
  return list;
}

export default function HomePage() {
  const [newApplicationState, dispatchAS] = React.useReducer(as_reducer, as_initial_state);
  const [applications, setApplications] = React.useState<Application[]|null>(null)
  const [alert, setAlert] = React.useState<AlertMessage|null>(null)

  React.useEffect(()=>{
    fetchPosts();
  }, [])

  const validatePath = async (path: string) => {
    let req_body = JSON.stringify({
      'path': path
    })
    let res = await fetch(`http://127.0.0.1:8000/utilities/validate/path`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json'
      },
      body: req_body
    })

    if(res.ok){
      console.log(''+path+' is valid '+ res.status)
      return true;
    }
    console.log(''+path+' is inValid')
    return false;
  }

  const handleSourcePathValidation = React.useCallback(async () => {
    let resp = ""
    let hasInvalidPath = false;
    for(let i=0; i<newApplicationState.services.length; i++){
      let isValid : boolean = await validatePath(newApplicationState.services[i].source_path);

      if(!isValid){
        resp = resp + "Path "+newApplicationState.services[i].source_path+" is not valid. "
        hasInvalidPath = true;
      }else{
        resp = resp + "Path "+newApplicationState.services[i].source_path+" is valid. "
      }
    }

    if(hasInvalidPath){
      setAlert({
        "severity": "error",
        "msg": resp
      })
    }else{
      setAlert({
        "severity": "success",
        "msg": resp
      })
    }

    return !hasInvalidPath;
  }, [newApplicationState])

  const fetchPosts = React.useCallback(async () => {
    let res = await fetch(`http://127.0.0.1:8000/application/`)
    let data = await res.json()
    console.log(data)
    setApplications(data)
  },[setApplications])

  const handleDeleteApplication = async (application_id: number) => {
    let res = await fetch(`http://127.0.0.1:8000/application/${application_id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json'
      }
    })
    fetchPosts();
    let data = await res.json()
    console.log('delete Application resp: ', data)
  }

  const handleSubmit = React.useCallback(async () => {

    let checkPathValidity = await handleSourcePathValidation();
    if(!checkPathValidity)
      return;

    let req_body = JSON.stringify({...newApplicationState})
    console.log(req_body)
    let res = await fetch(`http://127.0.0.1:8000/application/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json'
      },
      body: req_body
    });
    
    if(res.ok){
      dispatchAS({ type: NewApplicationAction.RESET});
      fetchPosts();
    }else{
      console.error('status:'+res.status+', statusText:'+res.statusText)
    }

    let data = await res.json();
    console.log(data);    
    
  }, [newApplicationState, dispatchAS])

  return (
    <div style={{color: 'white', padding: '20px', paddingTop: '100px' }}>
      <Card sx={{ minWidth: 275 }}>
        <CardHeader title="Add New Application"/>
        <CardContent>
          { alert && alert.severity=='success' &&
              <Alert variant="outlined" icon={<CheckIcon fontSize="inherit"/>} severity="success" onClose={() => {setAlert(null)}}>
                {alert.msg}
              </Alert>
            }
          { alert && alert.severity=='error' &&
            <Alert variant="outlined" icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error" onClose={() => {setAlert(null)}}>
              {alert.msg}
            </Alert>
          }
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            Application Details
          </Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Application Name"
                defaultValue=""
                value={newApplicationState.name}
                onChange={(e) => {
                  dispatchAS({ type: NewApplicationAction.SET_APPLICATION_NAME, value: e.target.value})
                }}
              />
              <TextField
                required
                type="number"
                id="outlined-required"
                label="# Services"
                defaultValue="1"
                value={newApplicationState.service_count}
                onChange={(e) => {
                  dispatchAS({ type: NewApplicationAction.SET_SERVICE_COUNT, value: e.target.value})
                }}
              />
            </div>
          </Box>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            Add Service(s)
          </Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >

            {getIndxes(newApplicationState.service_count).map((indx) => {
              return (
                <div key={indx}>
                  <TextField
                    required
                    id={`service-name-${indx}`}
                    label="Service Name"
                    value={newApplicationState?.services && newApplicationState.services[indx].name}
                    defaultValue="Service name"
                    onChange={(e) => {
                      dispatchAS({ type: NewApplicationAction.SET_SERVICE_NAME, index: indx, value: e.target.value})
                    }}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="Service Description"
                    value={newApplicationState?.services && newApplicationState.services[indx].description}
                    defaultValue="Description"
                    onChange={(e) => {
                      dispatchAS({ type: NewApplicationAction.SET_SERVICE_DESCRIPTION, index: indx, value: e.target.value})
                    }}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="Service Logfile Path"
                    defaultValue="Logfile path"
                    value={newApplicationState?.services && newApplicationState.services[indx].source_path}
                    onChange={(e) => {
                      dispatchAS({ type: NewApplicationAction.SET_SERVICE_PATH, index: indx, value: e.target.value})
                    }}
                  />
                </div>
              )
            })}
            
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleSourcePathValidation}>Verify Path Accessibility</Button>
          <Button size="small" onClick={handleSubmit}>Add New Application</Button>
        </CardActions>
      </Card>
      <Paper elevation={3} square={false} sx={{marginTop: '10px', padding: '10px 15px'}}>
        <Typography variant="h5" gutterBottom marginTop={'15px'} marginBottom={'25px'}>
          REGISTERED APPLICATIONS
        </Typography>
        <Grid container spacing={2} >
          {applications?.map((application) => {
            return (
              <Grid size={3} key={application.id} paddingBottom={'10px'}>
                <Card sx={{ minWidth: 275, height: 250, maxHeight: 250, backgroundColor: '#DCDCDC'}}>
                  <CardHeader 
                    title={application.name} 
                    subheader={'['+application.services?.length+' Services]'} 
                    action={
                      <IconButton aria-label="Delete-Application" onClick={()=>handleDeleteApplication(application.id)}>
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    }/>
                  <CardContent sx={{ height: 150, overflow: 'scroll'}}>
                    <List>
                      {application.services && application.services.map((service) => (<ListItem key={service.id} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <WorkIcon fontSize='small' />
                          </ListItemIcon>
                          <ListItemText primary={service.name} secondary={service.description}/>
                        </ListItemButton>
                      </ListItem>))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
    </div>
  );
}

