export class ForgotPasswordRequestDTO {
    readonly email: string;

    private constructor(email: string) {
        this.email = email;
    }

    static fromParsed(input: {
        email: string;
    }): ForgotPasswordRequestDTO {
        return new ForgotPasswordRequestDTO(
            input.email.trim().toLowerCase()
        );
    }
}
