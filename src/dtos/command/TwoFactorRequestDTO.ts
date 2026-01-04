export class TwoFactorRequestDTO {
    readonly code: string;

    private constructor(code: string) {
        this.code = code;
    }

    static fromParsed(input: {
        code: string;
    }): TwoFactorRequestDTO {
        return new TwoFactorRequestDTO(
            input.code.trim()
        );
    }
}
