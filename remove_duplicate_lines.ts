import { iter } from "https://deno.land/std@0.93.0/io/util.ts";

const N = Deno.env.get("NEWLINE") || "\n";
export type M = {
  b: boolean;
  d: string[];
  h: { [k: string]: boolean };
};

const i = Deno.args[0];
const o = Deno.args[1];

const f: Deno.File = Deno.openSync(i, { read: true });
const m: M = { d: [], h: {}, b: false };
const t: string = await Deno.makeTempFile();

let r = "";
for await (const ck of iter(f)) {
  const ls = (r + new TextDecoder().decode(ck)).split(N);
  r = ls[ls.length - 1];

  const ot = ls
    .slice(0, -1)
    .reduce((_m: M, l: string) => {
      if (!_m.h[l]) {
        _m.h[l] = true;
        _m.d.push(l);
      }
      return _m;
    }, m)
    .d.join(N);
  if (ot.length === 0) continue;

  const of = new TextEncoder().encode(m.b ? N + ot : ot);
  Deno.writeFileSync(t, of, { append: true });

  m.d = [];
  m.b = true;
}
f.close();

Deno.copyFileSync(t, o);
