import "./App.css";
import { useEffect, useRef, useState } from "react";

import allGames from "./assets/psp/games.json";

type RegionString = "ntscj" | "ntscu" | "pal";

// #region create games.json file
/* const checkRegion = (
  lr: string,
  nr: string,
  nl: string[],
  r: string,
  rr: RegionString,
  l: string
) => lr === r && nr === rr && nl.includes(l);

const allGames = [
  ...PSP_NTSCJ.map((o) => ({ ...o, region: "ntscj" } as GameData)),
  ...PSP_NTSCU.map((o) => ({ ...o, region: "ntscu" } as GameData)),
  ...PSP_PAL.map((o) => ({ ...o, region: "pal" } as GameData)),
].reduce<GameData[]>((p, n) => {
  if (p.find((g) => g.id === n.id)) return p;
  let lnk;
  if (
    (lnk = PSP_Links.find(
      (l) =>
        (checkRegion(l.region, n.region, n.langs, "Europe", "pal", "E") ||
          checkRegion(l.region, n.region, n.langs, "USA", "ntscu", "E") ||
          checkRegion(l.region, n.region, n.langs, "Japan", "ntscj", "J") ||
          checkRegion(l.region, n.region, n.langs, "China", "ntscj", "Ch") ||
          checkRegion(l.region, n.region, n.langs, "Korea", "ntscj", "K") ||
          checkRegion(l.region, n.region, n.langs, "Italy", "pal", "I") ||
          checkRegion(l.region, n.region, n.langs, "Spain", "pal", "S") ||
          checkRegion(l.region, n.region, n.langs, "Australia", "pal", "E") ||
          checkRegion(
            l.region,
            n.region,
            n.langs,
            "Netherlands",
            "pal",
            "Du"
          ) ||
          checkRegion(l.region, n.region, n.langs, "Sweden", "pal", "Sw") ||
          checkRegion(l.region, n.region, n.langs, "Germany", "pal", "G") ||
          checkRegion(l.region, n.region, n.langs, "France", "pal", "F")) &&
        n.name
          .replace(/[^a-z\d]/gi, "")
          .toLowerCase()
          .includes(l.name.replace(/[^a-z\d+]/gi, "").toLowerCase())
    ))
  ) {
    return [...p, { ...n, link: lnk.link }];
  }
  return [...p, n];
}, []);

console.log(allGames); */
// #endregion

function App() {
  const [searchText, setSearchText] = useState("");
  const [ntscu, setNtscu] = useState(true);
  const [ntscj, setNtscj] = useState(true);
  const [pal, setPal] = useState(true);
  const [searchNumber, setSearchNumber] = useState(0);

  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    setSearchNumber(tbodyRef.current?.childElementCount || 0);
  }, [tbodyRef.current?.childElementCount]);

  const searchQueries = searchText
    .trim()
    .split("\n")
    .map((q) => {
      const [_all, link, name, id, lang] =
        /^(!)?([^#]*?)(?:#(.*?))?(?:\((.*?)\))?$/.exec(q) || [];
      if (link || name || id || lang)
        return { link, name, id, lang: lang ? lang.split(",") : null };
      else return null;
    })
    .filter((r) => r !== null);

  return (
    <>
      <label htmlFor="ntscu">NTSCU</label>
      <input
        type="checkbox"
        name="ntscu"
        id="ntscu"
        checked={ntscu}
        onChange={(e) => setNtscu(e.currentTarget.checked)}
      />
      <br />
      <label htmlFor="ntscj">NTSCJ</label>
      <input
        type="checkbox"
        name="ntscj"
        id="ntscj"
        checked={ntscj}
        onChange={(e) => setNtscj(e.currentTarget.checked)}
      />
      <br />
      <label htmlFor="pal">PAL</label>
      <input
        type="checkbox"
        name="pal"
        id="pal"
        checked={pal}
        onChange={(e) => setPal(e.currentTarget.checked)}
      />
      <br />
      <div className="tx">
        <textarea
          name=""
          id=""
          cols={30}
          rows={10}
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
        ></textarea>
        <p>Found: {searchNumber}</p>
        <b>Instruction:</b>
        <br />
        Syntax:
        <br />! - downloadable
        <pre>
          <br />
          {"[!][<query>]*"} (or) where:,
          <br />
          &emsp;{"<query>:"}
          <br />
          &emsp;&emsp;{"[<name>][#<id>][(<lang>[,<lang>]*)]"} (and) where:
          <br />
          &emsp;&emsp;{"<name>"}: Name of the game (i.e wall-e)
          <br />
          &emsp;&emsp;{"<id>"}: ID of the game (i.e. ULES-0988 or ROSE-)
          <br />
          &emsp;&emsp;{"<lang>"}: Letter of language (i.e. K or Du)
          <br />
        </pre>
        Examples:
        <pre>
          &emsp;wall(I)
          <br />
          &emsp;wall#ulus
        </pre>
      </div>
      <table>
        <thead>
          <tr>
            <th>DBID</th>
            <th>REGION</th>
            <th>ID</th>
            <th>NAME</th>
            <th>LANGS</th>
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {allGames.map((tr, tri) => {
            if (
              !`${ntscu ? "ntscu" : ""}_${pal ? "pal" : ""}_${
                ntscj ? "ntscj" : ""
              }`.includes(tr.region)
            )
              return;
            if (
              searchQueries.length > 0 &&
              !searchQueries.reduce((p, n, xi, a) => {
                const { id, name, lang, link } = n || {};
                const check = (
                  i: string,
                  title: string,
                  l: string[],
                  lnk: string = ""
                ): boolean => {
                  if (link && !lnk) return false;
                  if (
                    lang &&
                    lang.filter((x) => l.includes(x.toLowerCase())).length === 0
                  )
                    return false;
                  if (id && name)
                    return (
                      i.includes(id.toLowerCase()) &&
                      title.includes(name.toLowerCase())
                    );
                  if (id) return i.includes(id.toLowerCase());
                  if (name) return title.includes(name.toLowerCase());
                  return !!lang || !!link;
                };
                return (
                  p ||
                  check(
                    tr.id.toLowerCase(),
                    tr.name.toLowerCase(),
                    tr.langs.map((l) => l.toLowerCase()),
                    tr.link
                  )
                );
              }, false)
            ) {
              return null;
            } else
              return (
                <tr key={`${tr.id}`}>
                  <td>{tri + 1}.</td>
                  <td style={{ textAlign: "center" }}>
                    {tr.region.toUpperCase()}
                  </td>
                  <td>{tr.id}</td>
                  <td>
                    {tr.link ? <a href={tr.link}>{tr.name}</a> : <>{tr.name}</>}
                  </td>
                  <td style={{ textAlign: "center" }}>{tr.langs.join(", ")}</td>
                </tr>
              );
          })}
        </tbody>
      </table>
    </>
  );
}

export default App;
