const quotes = [
  {
    quote:
      "PeakForms transformed how we collect product feedback. The clean Typeform-style interface tripled our response completion rates.",
    author: "Elena Rostova",
    role: "Head of Product, NorthVibe",
  },
  {
    quote:
      "Setting up conditional branching took less than two minutes. The CSV export and instant email notifications keep our operations running smoothly.",
    author: "Marcus Chen",
    role: "Lead Researcher, Apex Studio",
  },
  {
    quote:
      "Password protection on public links gave us total confidence to run sensitive internal surveys without complex user access setup.",
    author: "Sarah Lin",
    role: "Director of Ops, Synthesis AI",
  },
];

export function LandingTestimonials() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
          Loved by creators and product teams
        </h2>
        <p className="text-sm text-[#78726A]">
          Here is how teams use PeakForms for clear, focused feedback.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {quotes.map((q) => (
          <div
            key={q.author}
            className="claude-card rounded-2xl bg-[#FFFDF9] p-7 flex flex-col justify-between space-y-6"
          >
            <p className="peak-serif text-base leading-relaxed text-[#2D2926] italic">
              "{q.quote}"
            </p>

            <div className="border-t border-[#E5DFD5] pt-4 text-xs">
              <div className="font-medium text-[#2D2926]">{q.author}</div>
              <div className="text-[#78726A] mt-0.5">{q.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
