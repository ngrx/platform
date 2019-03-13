export interface Event {
  name: string;
  url: string;
  location: string;
  startDate?: string;
  endDate: string;
}

export interface DisplayEvent {
  name: string;
  url: string;
  location: string;
  startDate?: Date,
  endDate: Date
  dateRangeString: string;
}
