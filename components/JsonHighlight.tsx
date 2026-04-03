"use client";

import type { ReactNode } from "react";

function highlightTail(s: string) {
  const nodes: ReactNode[] = [];
  const re =
    /("(?:[^"\\]|\\.)*")|(true|false|null)|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) {
      nodes.push(
        <span key={`p-${k++}`} className="text-foreground">
          {s.slice(last, m.index)}
        </span>
      );
    }
    const tok = m[0];
    let cls = "text-foreground";
    if (tok.startsWith('"')) cls = "text-emerald-400/90";
    else if (tok === "true" || tok === "false") cls = "text-violet-400/90";
    else if (tok === "null") cls = "text-muted-foreground";
    else cls = "text-amber-400/90";
    nodes.push(
      <span key={`p-${k++}`} className={cls}>
        {tok}
      </span>
    );
    last = re.lastIndex;
  }
  if (last < s.length) {
    nodes.push(
      <span key={`p-${k++}`} className="text-foreground">
        {s.slice(last)}
      </span>
    );
  }
  return <>{nodes}</>;
}

export function JsonHighlight({ json }: { json: string }) {
  let pretty = json;
  try {
    pretty = JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    /* raw */
  }

  const lines = pretty.split("\n");
  return (
    <pre className="font-mono-data overflow-x-auto whitespace-pre-wrap break-words text-xs leading-relaxed">
      {lines.map((line, li) => {
        const km = line.match(/^(\s*)("(?:[^"\\]|\\.)*")\s*(:)(.*)$/);
        if (km) {
          const [, indent, key, colon, tail] = km;
          return (
            <span key={li} className="block">
              <span className="text-muted-foreground">{indent}</span>
              <span className="text-primary">{key}</span>
              <span className="text-muted-foreground">{colon}</span>
              {highlightTail(tail)}
            </span>
          );
        }
        return (
          <span key={li} className="block text-foreground">
            {highlightTail(line)}
          </span>
        );
      })}
    </pre>
  );
}
