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

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "evt-01",
    eventId: "EVT-901",
    title: "Q3 Executive All-Hands & Town Hall Meeting",
    category: "Event",
    startDate: "2026-08-05",
    endDate: "2026-08-05",
    time: "10:00 AM - 11:30 AM",
    location: "Main Auditorium & Zoom Live",
    organizer: "Executive Office",
    department: "All Departments",
    attendeesCount: 1248,
    description: "Quarterly town hall meeting covering H2 business expansion and employee awards.",
    status: "Confirmed",
  },
  {
    id: "evt-02",
    eventId: "EVT-902",
    title: "H2 Performance Appraisal Calibration Review",
    category: "Meeting",
    startDate: "2026-08-06",
    endDate: "2026-08-06",
    time: "02:00 PM - 04:00 PM",
    location: "Executive Suite 4B",
    organizer: "Aarav Mehta (CHRO)",
    department: "Human Resources",
    attendeesCount: 18,
    description: "Manager calibration review for H2 appraisal scores.",
    status: "Confirmed",
  },
  {
    id: "evt-03",
    eventId: "EVT-903",
    title: "Independence Day Public Holiday",
    category: "Holiday",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    time: "All Day",
    location: "Global Off-day",
    organizer: "Corporate Operations",
    department: "All Departments",
    description: "National public holiday across all India offices.",
    status: "Confirmed",
  },
  {
    id: "evt-04",
    eventId: "EVT-904",
    title: "Aarav Sharma's Birthday Celebration",
    category: "Birthday",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    time: "04:30 PM",
    location: "Floor 4 Cafeteria",
    organizer: "Engineering Team",
    department: "Product Engineering",
    attendeesCount: 45,
    description: "Team birthday cake celebration for Senior AI Engineer Aarav Sharma.",
    status: "Confirmed",
  },
  {
    id: "evt-05",
    eventId: "EVT-905",
    title: "Priya Patel's 3-Year Work Anniversary",
    category: "Anniversary",
    startDate: "2026-08-10",
    endDate: "2026-08-10",
    time: "All Day",
    location: "Mumbai Campus",
    organizer: "HR Ops Team",
    department: "Human Resources",
    description: "Celebrating 3 years of service with Northwind Industries.",
    status: "Confirmed",
  },
  {
    id: "evt-06",
    eventId: "EVT-906",
    title: "IT Support Night Shift Roster",
    category: "Shift",
    startDate: "2026-08-02",
    endDate: "2026-08-08",
    time: "10:00 PM - 06:00 AM",
    location: "Data Center Bay 2",
    organizer: "Priya N. (IT)",
    department: "Information Technology",
    attendeesCount: 6,
    description: "Rotational night shift monitoring server infrastructure.",
    status: "Confirmed",
  },
  {
    id: "evt-07",
    eventId: "EVT-907",
    title: "Vikram Sharma Earned Leave Out-of-Office",
    category: "Leave",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    time: "All Day",
    location: "Out of Office",
    organizer: "Vikram Sharma",
    department: "Product Engineering",
    description: "Approved paid earned leave.",
    status: "Confirmed",
  },
];
