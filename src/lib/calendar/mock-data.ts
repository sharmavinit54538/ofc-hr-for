export interface CalendarEvent {
  id: string;
  eventId: string;
  title: string;
  category: "Event" | "Meeting" | "Holiday" | "Birthday" | "Anniversary" | "Shift" | "Leave";
  startDate: string;
  endDate: string;
  time?: string;
  location?: string;
  organizer?: string;
  department?: string;
  attendeesCount?: number;
  description?: string;
  status: "Confirmed" | "Tentative" | "Cancelled";
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [];
