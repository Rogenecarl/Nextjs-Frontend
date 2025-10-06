"use client";

const stats = [
  {
    number: "1,000+",
    label: "Healthcare Providers",
    description: "Verified professionals"
  },
  {
    number: "50K+",
    label: "Happy Patients",
    description: "Satisfied customers"
  },
  {
    number: "100K+",
    label: "Appointments Booked",
    description: "Successful bookings"
  },
  {
    number: "24/7",
    label: "Customer Support",
    description: "Always here to help"
  }
];

export default function StatsSection() {
  return (
    <section className="relative z-10 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}