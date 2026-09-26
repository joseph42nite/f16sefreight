/**
 * No template has a branch that can never render.
 *
 * 🔴 Vue 2 keeps a `v-else-if` written after a plain `v-else` — it appends it to the chain, AFTER the branch that
 * catches everything — and says nothing, at build or at run time. That is how Financials → Reports showed only its
 * hint line from 2026-09-20 to 2026-09-26: a `v-else` paragraph put in the middle of the chain, and the P&L, balance
 * sheet and trial balance behind it, never drawn (GAPS #409). This walks every component's compiled template.
 */
const fs = require("fs");
const path = require("path");
const compiler = require("vue-template-compiler");

const root = path.join(__dirname, "../../resources/js");

function vueFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return vueFiles(full);
    return entry.name.endsWith(".vue") ? [full] : [];
  });
}

/** Every chain in which a plain `v-else` is followed by another branch. */
function unreachable(node, found = []) {
  if (!node || node.type !== 1) return found;

  const conditions = node.ifConditions || [];
  conditions.forEach((condition, i) => {
    if (condition.exp === undefined && i < conditions.length - 1) {
      found.push(`<${conditions[i + 1].block.tag} v-else-if="${conditions[i + 1].exp}"> after a v-else`);
    }
  });

  // The branches of a chain hang off its first element, not the children.
  conditions.slice(1).forEach((condition) => unreachable(condition.block, found));
  (node.children || []).forEach((child) => unreachable(child, found));
  (node.scopedSlots ? Object.values(node.scopedSlots) : []).forEach((slot) => unreachable(slot, found));

  return found;
}

describe("template v-if chains", () => {
  it("finds the branch that can never render", () => {
    const { ast } = compiler.compile('<div><p v-if="a">1</p><p v-else>2</p><p v-else-if="b">3</p></div>');
    expect(unreachable(ast)).toEqual(['<p v-else-if="b"> after a v-else']);
  });

  it("has none in any component", () => {
    const problems = vueFiles(root).flatMap((file) => {
      const { template } = compiler.parseComponent(fs.readFileSync(file, "utf8"));
      if (!template) return [];
      return unreachable(compiler.compile(template.content).ast).map((p) => `${path.relative(root, file)}: ${p}`);
    });

    expect(problems).toEqual([]);
  });
});
