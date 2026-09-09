function splitInline(text) {
  const tokens = [];
  let buf = "";
  let i = 0;
  const flush = () => {
    if (buf) tokens.push({ type: "text", value: buf });
    buf = "";
  };

  while (i < text.length) {
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        tokens.push({ type: "bold", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        tokens.push({ type: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1 && end !== i + 1) {
        flush();
        tokens.push({ type: "italic", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return tokens;
}

function renderInline(text, keyPrefix) {
  return splitInline(text).map((tok, i) => {
    const key = `${keyPrefix}-${i}`;
    if (tok.type === "bold") return <strong key={key}>{tok.value}</strong>;
    if (tok.type === "italic") return <em key={key}>{tok.value}</em>;
    if (tok.type === "code") {
      return (
        <code
          key={key}
          className="rounded bg-[var(--line)]/10 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {tok.value}
        </code>
      );
    }
    return <span key={key}>{tok.value}</span>;
  });
}

function isSeparatorRow(line) {
  return line.includes("|") && /^[|:\-\s]+$/.test(line);
}

function classify(line) {
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) return "hr";
  if (/^#{1,6}\s+/.test(line)) return "heading";
  if (/^\d+[.)]\s+/.test(line)) return "ordered";
  if (/^[-*]\s+/.test(line)) return "bullet";
  if (isSeparatorRow(line)) return "separator";
  if (line.includes("|")) return "table";
  return "text";
}

function tableCells(row) {
  const cells = row.split("|").map((c) => c.trim());
  if (cells[0] === "") cells.shift();
  if (cells[cells.length - 1] === "") cells.pop();
  return cells;
}

function buildBlocks(content) {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const type = classify(lines[i]);

    if (type === "separator") {
      i++;
      continue;
    }

    if (type === "hr") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    if (type === "table") {
      const rows = [];
      while (i < lines.length) {
        const t = classify(lines[i]);
        if (t === "table") {
          rows.push(lines[i]);
          i++;
        } else if (t === "separator") {
          i++;
        } else break;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    if (type === "ordered") {
      const items = [];
      while (i < lines.length && classify(lines[i]) === "ordered") {
        const match = lines[i].match(/^(\d+)[.)]\s+(.*)$/);
        items.push({ number: match[1], text: match[2] });
        i++;
      }
      blocks.push({ type, items });
      continue;
    }

    if (type === "bullet") {
      const items = [];
      while (i < lines.length && classify(lines[i]) === "bullet") {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type, items });
      continue;
    }

    if (type === "heading") {
      const match = lines[i].match(/^(#{1,6})\s+(.*)$/);
      blocks.push({ type: "heading", level: match[1].length, text: match[2] });
      i++;
      continue;
    }

    const textLines = [];
    while (i < lines.length && classify(lines[i]) === "text") {
      textLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", lines: textLines });
  }
  return blocks;
}

export function ChatMarkdown({ content }) {
  const blocks = buildBlocks(content);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((b, bi) => {
        if (b.type === "heading") {
          return (
            <p key={bi} className="font-display text-base font-bold">
              {renderInline(b.text, `${bi}`)}
            </p>
          );
        }

        if (b.type === "hr") {
          return <hr key={bi} className="border-t-2 border-[var(--line)]/15" />;
        }

        if (b.type === "ordered") {
          // Rendered with the model's own literal numbers (not a native <ol>, which would
          // restart every item at "1." whenever sub-bullets split one numbered item from the
          // next into separate blocks).
          return (
            <div key={bi} className="flex flex-col gap-1.5">
              {b.items.map((item, ii) => (
                <div key={ii} className="flex gap-2">
                  <span className="shrink-0 font-bold">{item.number}.</span>
                  <span>{renderInline(item.text, `${bi}-${ii}`)}</span>
                </div>
              ))}
            </div>
          );
        }

        if (b.type === "bullet") {
          return (
            <ul key={bi} className="list-disc space-y-1.5 pl-5">
              {b.items.map((item, ii) => (
                <li key={ii}>{renderInline(item, `${bi}-${ii}`)}</li>
              ))}
            </ul>
          );
        }

        if (b.type === "table") {
          const [headerRow, ...bodyRows] = b.rows;
          return (
            <div key={bi} className="overflow-x-auto rounded-md border-2 border-[var(--line)]">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--background)]">
                    {tableCells(headerRow).map((c, ci) => (
                      <th
                        key={ci}
                        className="border-b-2 border-[var(--line)] px-2.5 py-1.5 text-left font-bold"
                      >
                        {renderInline(c, `${bi}h${ci}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 1 ? "bg-[var(--background)]/60" : ""}>
                      {tableCells(row).map((c, ci) => (
                        <td
                          key={ci}
                          className="border-b border-[var(--line)]/15 px-2.5 py-1.5 align-top"
                        >
                          {renderInline(c, `${bi}-${ri}-${ci}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={bi} className="leading-relaxed">
            {b.lines.map((l, li) => (
              <span key={li}>
                {renderInline(l, `${bi}-${li}`)}
                {li < b.lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
