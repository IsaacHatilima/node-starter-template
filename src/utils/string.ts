export function toTitleCase(str: string) {
    return str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\b\p{L}/gu, c => c.toUpperCase());
}
