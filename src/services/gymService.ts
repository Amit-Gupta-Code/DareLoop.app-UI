import API from "../api/client";

export interface GymTrainer {
  id: number;
  name: string | null;
  handle: string | null;
  bio: string | null;
  specialties: string[];
}

export interface GymPlan {
  id: number;
  name: string;
  type: string;
  duration_days: number | null;
  session_count: number | null;
  price: string | number;
  currency: string;
}

export interface GymMembership {
  id: number;
  organization_id: number;
  organization_name: string | null;
  branch_id: number | null;
  branch_name: string | null;
  type: string;
  status: string;
  started_at: string;
  ends_at: string | null;
  sessions_remaining: number | null;
  plan: GymPlan | null;
  trainer: GymTrainer | null;
}

export interface GymAttendance {
  id: number;
  organization_id: number;
  branch_id: number;
  branch_name: string | null;
  provider: string;
  checked_in_at: string;
  checked_out_at: string | null;
}

export interface GymClassBooking {
  id: number;
  gym_class_id: number;
  status: string;
  waitlist_position: number | null;
  booked_at: string;
  cancelled_at: string | null;
}

export interface GymClass {
  id: number;
  organization_id: number;
  branch_id: number;
  branch_name: string | null;
  name: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  capacity: number;
  spots_remaining: number;
  waitlist_capacity: number;
  status: string;
  trainer: GymTrainer | null;
  my_booking: GymClassBooking | null;
}

export interface GymOverview {
  organizations: Array<{ id: number; name: string; slug: string; role: string | null }>;
  memberships: GymMembership[];
  trainer: GymTrainer | null;
  outstanding?: {
    currency: string;
    amount_due: string | number;
    invoice_count: number;
  };
}

export interface GymInvoice {
  id: number;
  organization_id: number;
  organization_name: string | null;
  kind: string;
  status: string;
  invoice_number: string | null;
  issued_at: string | null;
  due_at: string | null;
  currency: string;
  total: string | number;
  amount_paid: string | number;
  amount_due: string | number;
}

const dataOf = <T>(res: { data: { data: T } }): T => res.data.data;

export const getMyGym = async (): Promise<GymOverview> =>
  dataOf<GymOverview>(await API.get("/gym/my"));

export const getMyAttendance = async (): Promise<GymAttendance[]> =>
  dataOf<GymAttendance[]>(await API.get("/gym/attendance"));

export const getGymClasses = async (): Promise<GymClass[]> =>
  dataOf<GymClass[]>(await API.get("/gym/classes"));

export const bookGymClass = async (classId: number): Promise<GymClass> =>
  dataOf<GymClass>(await API.post(`/gym/classes/${classId}/book`));

export const cancelGymBooking = async (bookingId: number): Promise<GymClassBooking> =>
  dataOf<GymClassBooking>(await API.post(`/gym/bookings/${bookingId}/cancel`));

export const checkInToGym = async (payload: {
  branch_id?: number;
  code?: string;
  token?: string;
  qr_payload?: string;
}): Promise<GymAttendance> =>
  dataOf<GymAttendance>(await API.post("/gym/attendance/check-in", payload));

export const getMyInvoices = async (): Promise<GymInvoice[]> =>
  dataOf<GymInvoice[]>(await API.get("/gym/invoices"));

export const getMyDues = async (): Promise<NonNullable<GymOverview["outstanding"]>> =>
  dataOf<NonNullable<GymOverview["outstanding"]>>(await API.get("/gym/dues"));
