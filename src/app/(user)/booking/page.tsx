import { BookingList } from "@/components/User/booking/booking-card";

export default function Home() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Booking Management
        </h1>
        <p className="text-muted-foreground">
          Manage and track all your bookings in one place
        </p>
      </div>
      <BookingList />
    </>
  );
}
