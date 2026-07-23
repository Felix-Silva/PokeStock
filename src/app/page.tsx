type Observation = {
  date: string;
  day: string;
  score: number;
  result: string;
};

const sampleObservations: Observation[] = [
  { date: "6/27/2026, 10:10 AM", day: "Saturday", score: 3, result: "Some scraps left." },
  { date: "6/30/2026, 12:10 PM", day: "Tuesday", score: 0, result: "Nothing, hasn't been stocked in a minute" },
  { date: "7/3/2026, 3:15 PM", day: "Friday", score: 0, result: "Nothing. Empty." },
  { date: "7/3/2026, 4:15 PM", day: "Friday", score: 9, result: "Restock. ETBs etc." },
];

type RubricRow = {
  observation: string;
  score: number;
};

const scoringRubric: RubricRow[] = [
  { observation: "Freshly stocked, overflowing, everything available", score: 10 },
  { observation: "Most products available, multiple ETBs", score: 8 },
  { observation: "Some ETBs and good selection", score: 6 },
  { observation: "Mostly blister packs and singles left", score: 4 },
  { observation: "Few items remaining", score: 2 },
  { observation: "Empty", score: 0 },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      <h1 className="text-3xl font-semibold">PokeStock</h1>
      <div className="flex w-full max-w-4xl flex-col gap-8 md:flex-row md:items-start">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-left text-zinc-400">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Day</th>
              <th className="py-2 pr-4 font-medium">Score</th>
              <th className="py-2 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {sampleObservations.map((obs) => (
              <tr key={obs.date} className="border-b border-zinc-800">
                <td className="py-2 pr-4 whitespace-nowrap">{obs.date}</td>
                <td className="py-2 pr-4">{obs.day}</td>
                <td className="py-2 pr-4">{obs.score}</td>
                <td className="py-2">{obs.result}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full max-w-sm shrink-0 border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-left text-zinc-400">
              <th className="py-2 pr-4 font-medium">Observation</th>
              <th className="py-2 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {scoringRubric.map((row) => (
              <tr key={row.score} className="border-b border-zinc-800">
                <td className="py-2 pr-4">{row.observation}</td>
                <td className="py-2">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
