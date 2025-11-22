export function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}