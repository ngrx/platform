export interface EventResponse {
    name: string;
    url: string;
    location: string;
    startDate?: string;
    endDate: string;
}

export interface Event {
    name: string;
    url: string;
    location: string;
    startDate?: Date;
    endDate: Date;
}
