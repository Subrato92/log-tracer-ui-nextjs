export {}

declare global {

    interface AlertMessage{
        severity: string
        msg: string
    }

    interface NewApplicationState {
        name: string
        service_count: number
        services: NewServiceState[]
    }

    interface NewServiceState {
        description: string
        name: string
        source_path: string
    }

    interface Application {
        archive_path: string | null | undefined
        id: number | null | undefined
        is_active: boolean | null | undefined
        name: string
        services: Array<Service> | null | undefined
    }

    interface Service{
        archive_path: string | null | undefined
        description: string
        id: number | null | undefined
        name: string
        source_path: string
    }

    interface ApplicationState{
        startDateTimeValue: string | null | undefined
        endDateTimeValue: string | null | undefined
        selectedApplicationService: number | null
    }
  }