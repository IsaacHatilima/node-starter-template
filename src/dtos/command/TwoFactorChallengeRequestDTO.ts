export class TwoFactorChallengeRequestDTO {
    readonly challenge_id: string;
    readonly code: string;

    private constructor(challenge_id: string, code: string) {
        this.challenge_id = challenge_id;
        this.code = code;
    }

    static fromParsed(input: {
        challenge_id: string;
        code: string;
    }): TwoFactorChallengeRequestDTO {
        return new TwoFactorChallengeRequestDTO(
            input.challenge_id.trim(),
            input.code.trim()
        );
    }
}
