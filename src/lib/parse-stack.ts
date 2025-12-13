export function parseStack(stack?: string) {
    if (!stack) return undefined;

    return stack
        .split("\n")
        .slice(1) // drop "Error: message"
        .map((line) => {
            const trimmed = line.trim();

            // at fn (file:line:col)
            const match =
                trimmed.match(/^at (.+?) \((.+):(\d+):(\d+)\)$/) ||
                trimmed.match(/^at (.+):(\d+):(\d+)$/);

            if (!match) {
                return {raw: trimmed};
            }

            if (match.length === 5) {
                return {
                    function: match[1],
                    file: match[2],
                    line: Number(match[3]),
                    column: Number(match[4]),
                };
            }

            return {
                file: match[1],
                line: Number(match[2]),
                column: Number(match[3]),
            };
        });
}

export function parsePrismaError(err: any) {
    if (!err || typeof err.message !== "string") return undefined;

    const lines = err.message
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean);

    const summary =
        lines.find((l: string) => l.startsWith("Can't reach")) ||
        lines.find((l: string) => l.startsWith("Invalid")) ||
        lines[lines.length - 1];

    const locationMatch = err.message.match(
        /→\s*(\d+).*\n.*prisma\.(\w+)\.(\w+)/
    );

    return {
        summary,
        code: (err as any).code,
        operation: locationMatch
            ? `${locationMatch[2]}.${locationMatch[3]}`
            : undefined,
        location: locationMatch
            ? {line: Number(locationMatch[1])}
            : undefined,
    };
}


