"use client"
import * as React from 'react';
import { Inter } from "next/font/google";
import ApplicationDrawer from "@/components/ApplicationDrawer";
import { Box, Stack } from "@mui/material";
import { ApplicationContext } from "@/helpers/Contexts";
import { Dayjs } from 'dayjs';

const inter = Inter({ subsets: ["latin"] });

const DateFormatter = (dateTime: Dayjs | null) => {
  if(!dateTime)
    return '';
  
  let dateTimeStr = ''+dateTime.year();
  dateTimeStr = dateTimeStr + '-' + (dateTime.month()+1).toString().padStart(2,'0');
  dateTimeStr = dateTimeStr + '-' + dateTime.date().toString().padStart(2,'0');
  dateTimeStr = dateTimeStr + ' ' + dateTime.hour().toString().padStart(2,'0');
  dateTimeStr = dateTimeStr + ':' + dateTime.minute().toString().padStart(2,'0')
  dateTimeStr = dateTimeStr + ':' + dateTime.second().toString().padStart(2,'0')+'.000000';

  //console.log('dateTimeStr: '+dateTimeStr);

  return dateTimeStr;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedApplicationService, setSelectedApplicationService] = React.useState<number | null>(null)
  const [applications, setApplications] = React.useState<Application[]|null>(null)
  const [startDateTimeValue, setStartDateTimeValue] = React.useState<Dayjs|null>(null);
  const [endDateTimeValue, setEndDateTimeValue] = React.useState<Dayjs|null>(null);
  const [searchApplicationState, setSearchApplicationState] = React.useState<ApplicationState>({
    'startDateTimeValue': DateFormatter(startDateTimeValue),
    'endDateTimeValue': DateFormatter(endDateTimeValue),
    'selectedApplicationService': selectedApplicationService
  });

  React.useEffect(() => {
      async function fetchPosts() {
          let res = await fetch(`http://127.0.0.1:8000/application/`)
          let data = await res.json()
          console.log(data)
          setApplications(data)
      }
      fetchPosts()
  }, [])

  React.useEffect(() => {
    setSearchApplicationState({
      'startDateTimeValue': DateFormatter(startDateTimeValue),
      'endDateTimeValue': DateFormatter(endDateTimeValue),
      'selectedApplicationService': selectedApplicationService
    })
}, [selectedApplicationService, startDateTimeValue, endDateTimeValue])

  return (
    <ApplicationContext.Provider value={searchApplicationState}>
        <Stack direction="row" spacing={2}>
            <ApplicationDrawer 
                applications={applications} 
                setSelectedApplicationService={setSelectedApplicationService} 
                selectedApplicationService={selectedApplicationService}
                startDateTimeValue={startDateTimeValue}
                setStartDateTimeValue={setStartDateTimeValue}
                endDateTimeValue={endDateTimeValue}
                setEndDateTimeValue={setEndDateTimeValue}/>
            {children}
        </Stack>
    </ApplicationContext.Provider>
  );
}
