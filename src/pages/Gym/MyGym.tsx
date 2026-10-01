import { useEffect, useState, type FormEvent } from "react";
import { Calendar, CheckCircle2, Dumbbell, QrCode, Receipt } from "lucide-react";
import { SEOHead } from "@/src/seo/SEOHead";
import {
  bookGymClass,
  cancelGymBooking,
  checkInToGym,
  getGymClasses,
  getMyAttendance,
  getMyGym,
  getMyInvoices,
  type GymAttendance,
  type GymClass,
  type GymInvoice,
  type GymOverview,
} from "@/src/services/gymService";

const MyGym = () => {
  const [overview, setOverview] = useState<GymOverview | null>(null);
  const [attendance, setAttendance] = useState<GymAttendance[]>([]);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [invoices, setInvoices] = useState<GymInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError(null);
    try {
      const [gym, att, cls, inv] = await Promise.all([
        getMyGym(),
        getMyAttendance(),
        getGymClasses(),
        getMyInvoices(),
      ]);
      setOverview(gym);
      setAttendance(att);
      setClasses(cls);
      setInvoices(inv);
    } catch {
      setError("Could not load your gym data.");
      setOverview({ organizations: [], memberships: [], trainer: null });
      setAttendance([]);
      setClasses([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const hasGym = (overview?.organizations.length ?? 0) > 0 || (overview?.memberships.length ?? 0) > 0;

  const onCheckIn = async (e: FormEvent) => {
    e.preventDefault();
    const raw = code.trim();
    if (!raw) return;
    setBusy(true);
    setError(null);
    try {
      const branchId = overview?.memberships.find((m) => m.branch_id)?.branch_id;
      await checkInToGym({
        branch_id: branchId ?? undefined,
        token: raw.includes(":") ? raw : undefined,
        code: raw.includes(":") ? undefined : raw,
      });
      setCode("");
      await load();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || "Check-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const onBook = async (classId: number) => {
    setBusy(true);
    setError(null);
    try {
      await bookGymClass(classId);
      await load();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || "Could not book that class.");
    } finally {
      setBusy(false);
    }
  };

  const onCancel = async (bookingId: number) => {
    setBusy(true);
    setError(null);
    try {
      await cancelGymBooking(bookingId);
      await load();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || "Could not cancel that booking.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SEOHead title="My Gym | DareLoop" canonical="/my-gym" />
      <h1 className="text-3xl md:text-4xl font-black">My Gym</h1>
      <p className="text-text-muted mt-2">
        Membership, attendance, classes, invoices, and your assigned trainer. Gym administration stays in the gym back office.
      </p>

      {loading && <p className="mt-8 text-text-muted">Loading…</p>}
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      {!loading && !hasGym && (
        <div className="card-main mt-8">
          <p className="text-text-muted">
            You are not a member of a gym yet. When a gym adds you, your membership status, check-ins, class bookings, invoices, and assigned trainer will appear here. Nothing is fabricated.
          </p>
        </div>
      )}

      {!loading && hasGym && (
        <div className="mt-8 grid gap-6">
          {overview?.memberships.map((m) => (
            <div key={m.id} className="card-main">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="stat-label">Membership</p>
                  <h2 className="text-2xl">{m.plan?.name ?? m.organization_name ?? "Membership"}</h2>
                  <p className="text-text-muted mt-1">
                    {m.organization_name}
                    {m.branch_name ? ` · ${m.branch_name}` : ""}
                  </p>
                </div>
                <span className="badge-green">{m.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                {m.ends_at && <span>Expires {m.ends_at.slice(0, 10)}</span>}
                {m.sessions_remaining !== null && <span>{m.sessions_remaining} sessions left</span>}
                <span className="uppercase tracking-wide text-text-muted">{m.type}</span>
              </div>
            </div>
          ))}

          {overview?.outstanding && Number(overview.outstanding.invoice_count) > 0 && (
            <div className="card-main">
              <p className="stat-label flex items-center gap-2">
                <Receipt size={16} /> Outstanding dues
              </p>
              <h2 className="text-xl mt-1">
                {overview.outstanding.currency} {overview.outstanding.amount_due}
              </h2>
              <p className="text-text-muted mt-1">
                {overview.outstanding.invoice_count} open invoice{Number(overview.outstanding.invoice_count) === 1 ? "" : "s"}
              </p>
            </div>
          )}

          {overview?.trainer && (
            <div className="card-main">
              <p className="stat-label flex items-center gap-2">
                <Dumbbell size={16} /> Assigned trainer
              </p>
              <h2 className="text-xl mt-1">{overview.trainer.name ?? "Trainer"}</h2>
              {overview.trainer.bio && <p className="text-text-muted mt-2">{overview.trainer.bio}</p>}
            </div>
          )}

          <div className="card-main">
            <p className="stat-label flex items-center gap-2">
              <QrCode size={16} /> Check in
            </p>
            <form onSubmit={onCheckIn} className="mt-3 flex flex-col sm:flex-row gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Door code or dareloop:checkin:…"
                className="flex-1 border border-border-sleek rounded-xl px-4 py-3 bg-card-bg"
              />
              <button type="submit" disabled={busy} className="btn-viral">
                Check in
              </button>
            </form>
          </div>

          <div className="card-main">
            <p className="stat-label flex items-center gap-2">
              <Calendar size={16} /> Upcoming classes
            </p>
            {classes.length === 0 && <p className="mt-3 text-text-muted">No upcoming classes.</p>}
            <div className="mt-4 grid gap-3">
              {classes.map((c) => (
                <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-sleek rounded-2xl p-4">
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-sm text-text-muted">
                      {c.starts_at.replace("T", " ").slice(0, 16)}
                      {c.branch_name ? ` · ${c.branch_name}` : ""} · {c.spots_remaining} spots left
                      {c.my_booking ? ` · ${c.my_booking.status}` : ""}
                    </p>
                  </div>
                  {c.my_booking && (c.my_booking.status === "booked" || c.my_booking.status === "waitlisted") ? (
                    <button type="button" disabled={busy} className="btn-secondary" onClick={() => onCancel(c.my_booking!.id)}>
                      Cancel
                    </button>
                  ) : (
                    <button type="button" disabled={busy} className="btn-viral" onClick={() => onBook(c.id)}>
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card-main">
            <p className="stat-label flex items-center gap-2">
              <CheckCircle2 size={16} /> Attendance
            </p>
            {attendance.length === 0 && <p className="mt-3 text-text-muted">No check-ins yet.</p>}
            <ul className="mt-4 space-y-2">
              {attendance.slice(0, 20).map((row) => (
                <li key={row.id} className="text-sm flex justify-between gap-4">
                  <span>{row.branch_name ?? "Check-in"}</span>
                  <span className="text-text-muted">{row.checked_in_at.replace("T", " ").slice(0, 16)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-main">
            <p className="stat-label flex items-center gap-2">
              <Receipt size={16} /> Invoices
            </p>
            {invoices.length === 0 && <p className="mt-3 text-text-muted">No invoices yet.</p>}
            <ul className="mt-4 space-y-2">
              {invoices.map((row) => (
                <li key={row.id} className="text-sm flex justify-between gap-4">
                  <span>
                    {row.invoice_number ?? `Invoice #${row.id}`}
                    <span className="text-text-muted"> · {row.status}</span>
                  </span>
                  <span className="text-text-muted">
                    {row.currency} {row.total}
                    {Number(row.amount_due) > 0 ? ` · due ${row.amount_due}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGym;
