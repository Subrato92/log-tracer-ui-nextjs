"use client"
import * as React from 'react';
import { Stack } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ApplicationContext } from '@/helpers/Contexts';

const columns: GridColDef[] = [
  { field: 'id', headerName: '#', width: 50, headerClassName: 'text-lg text-slate-900 font-semibold' },
  { field: 'logs', headerName: 'Logs', flex: 1, headerClassName: 'text-lg text-slate-900 font-semibold' }
];

const createRandomRow = (id: number, log: string) => {
  return { id: id, logs: log };
};

const getRows = (logs: Array<string> | null) => {
  if(logs==null || !Array.isArray(logs))
    return [];

  let rows = logs.map((log, id) => createRandomRow(id, log));
  return rows;
}

export default function SearchAppBar() {
  const applicationState = React.useContext<ApplicationState | null>(ApplicationContext)
  const [logs, setLogs] = React.useState<Array<string> | null>(null)
    //2024-09-01 13:00:15.222910
  console.log(applicationState?.startDateTimeValue)
  console.log(applicationState?.endDateTimeValue)
  React.useEffect(() => {
    async function fetchPosts() {
      console.log('Sending Req...')
      if(applicationState){
        let res = await fetch(`http://127.0.0.1:8000/log/${applicationState.selectedApplicationService}/${applicationState.startDateTimeValue}/${applicationState.endDateTimeValue}`)
        let data = await res.json()
        console.log('logData: '+data)
        setLogs(data)
      }
    }
    fetchPosts()
  }, [applicationState])

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ paddingTop: '75px', width: '82%'}}
    >
      <div style={{ height: '87vh', width: '100%' }}>
        <DataGrid
        rows={getRows(logs)}
        columns={columns} 
        getRowHeight={() => 'auto'} 
        pageSizeOptions={[50, 100]}
        slots={{
            toolbar: GridToolbar
        }}
        sx={{color: 'black', m: 2, backgroundColor: 'white'}}/>
      </div>
    </Stack>
  );
}

