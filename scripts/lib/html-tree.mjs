import { Parser } from "htmlparser2";

/**
 * Parses html into a tree. Each element node:
 *   { tag, attribs, start, end, items: [ {type:'text', data} | {type:'tag', node} ] }
 * `items` preserves source order of text and child elements.
 * start/end are byte offsets into the ORIGINAL html string such that
 * html.slice(node.start, node.end) is the exact source text of that element.
 */
export function parseTree(html) {
  const root = { tag: "#root", attribs: {}, start: 0, end: html.length, items: [] };
  const stack = [root];

  const parser = new Parser(
    {
      onopentag(name, attribs) {
        const node = { tag: name, attribs, start: parser.startIndex, end: null, items: [] };
        stack[stack.length - 1].items.push({ type: "tag", node });
        stack.push(node);
      },
      ontext(text) {
        stack[stack.length - 1].items.push({ type: "text", data: text });
      },
      onclosetag() {
        const node = stack.pop();
        node.end = parser.endIndex + 1; // endIndex is inclusive index of last char
      },
    },
    { decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true }
  );
  parser.write(html);
  parser.end();

  return root;
}

export function fullText(node) {
  let out = "";
  for (const item of node.items) {
    if (item.type === "text") out += item.data;
    else out += fullText(item.node);
  }
  return out;
}

/** Direct child element tags only (depth 1), in order. */
export function childTags(node) {
  return node.items.filter((i) => i.type === "tag").map((i) => i.node.tag);
}

export function findAll(root, predicate) {
  const out = [];
  function walk(n) {
    if (n !== root && predicate(n)) out.push(n);
    for (const item of n.items) {
      if (item.type === "tag") walk(item.node);
    }
  }
  walk(root);
  return out;
}

export function normalizeHeading(text) {
  return text
    .replace(/^[\s\-–—]+/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Remove a set of [start,end) byte ranges from html. Ranges may be given in
 * any order; must not overlap. */
export function removeRanges(html, ranges) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const r of sorted) {
    if (r.start < cursor) throw new Error(`overlapping ranges at ${r.start}`);
    out += html.slice(cursor, r.start);
    cursor = r.end;
  }
  out += html.slice(cursor);
  return out;
}
