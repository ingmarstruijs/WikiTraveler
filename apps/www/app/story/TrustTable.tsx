const TIERS = [
  {
    tier: "OFFICIAL",
    meaning: "Baseline from OSM / Wikidata-style sources",
  },
  {
    tier: "AI_GUESS",
    meaning: "Machine estimate to guide auditors — not ground truth",
  },
  {
    tier: "VERIFIED",
    meaning: "A field audit happened",
  },
  {
    tier: "CONFIRMED",
    meaning: "Multiple independent auditors agree",
  },
] as const;

export function TrustTable() {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Tier</th>
          <th scope="col">Meaning</th>
        </tr>
      </thead>
      <tbody>
        {TIERS.map((row) => (
          <tr key={row.tier}>
            <td>
              <code>{row.tier}</code>
            </td>
            <td>{row.meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
