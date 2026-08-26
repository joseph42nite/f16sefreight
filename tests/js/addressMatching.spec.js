/**
 * Party matching — the Levenshtein matcher in airWayBillMixin.js.
 *
 * This is load-bearing, not cosmetic. An extracted shipper/consignee is matched
 * against the saved address book, and on a match the CURATED record replaces the
 * OCR text — which is what keeps a party's name byte-identical across the master
 * and every house. Customs rejects master/house mismatches, and free-typed party
 * names are where those come from (PRD.md §5.1).
 *
 * Two directions matter equally:
 *   - it must match through OCR noise (case, punctuation, spacing)
 *   - it must NOT match a genuinely different company, because a false match
 *     silently ships cargo to the wrong consignee
 */
import airWayBillMixin from '@/core/mixins/airWayBillMixin';

// The mixin's matching helpers are plain functions on `methods`; bind a bare
// object so they can be exercised without mounting a component.
const m = {};
Object.entries(airWayBillMixin.methods).forEach(([name, fn]) => {
    if (typeof fn === 'function') m[name] = fn.bind(m);
});

const saved = [
    { name: 'GLOBEX CORPORATION PVT LTD', address: '12 Marine Drive, Mumbai' },
    { name: 'Initech Logistics GmbH', address: 'Hafenstrasse 44, Hamburg' },
    { name: 'Umbrella Trading Co', address: '9 Raffles Place, Singapore' },
];

describe('normalizeText', () => {
    it('reduces to lowercase alphanumerics so punctuation cannot break a match', () => {
        expect(m.normalizeText('GLOBEX CORP. (PVT) LTD.')).toBe('globexcorppvtltd');
    });

    it('treats null and empty input as an empty string rather than throwing', () => {
        expect(m.normalizeText(null)).toBe('');
        expect(m.normalizeText('')).toBe('');
    });
});

describe('calculateSimilarity', () => {
    it('scores an exact match as 1.0', () => {
        expect(m.calculateSimilarity('Globex Corp', 'Globex Corp')).toBe(1.0);
    });

    it('ignores case, punctuation and spacing differences', () => {
        expect(m.calculateSimilarity('GLOBEX CORP.', 'globex  corp')).toBe(1.0);
    });

    it('scores an unrelated name low enough to be rejected', () => {
        expect(m.calculateSimilarity('Globex Corporation', 'Umbrella Trading')).toBeLessThan(0.9);
    });

    it('returns 0 when either side is missing, never NaN', () => {
        expect(m.calculateSimilarity('Globex', null)).toBe(0);
        expect(m.calculateSimilarity(null, null)).toBe(0);
    });
});

describe('findMatchingAddress', () => {
    it('matches through typical OCR noise', () => {
        const hit = m.findMatchingAddress(
            { name: 'GLOBEX CORPORATION PVT LTD.', address: '12 Marine Drive, Mumbai' },
            saved
        );
        expect(hit).not.toBeNull();
        expect(hit.name).toBe('GLOBEX CORPORATION PVT LTD');
    });

    it('does NOT match a different company — a false match ships cargo to the wrong consignee', () => {
        const hit = m.findMatchingAddress(
            { name: 'Globalex Shipping Ltd', address: '77 Nowhere Road, Delhi' },
            saved
        );
        expect(hit).toBeNull();
    });

    it('returns null rather than throwing when the book is empty or the name is missing', () => {
        expect(m.findMatchingAddress({ name: 'Globex', address: 'x' }, [])).toBeNull();
        expect(m.findMatchingAddress({ name: '', address: 'x' }, saved)).toBeNull();
        expect(m.findMatchingAddress(null, saved)).toBeNull();
    });
});
