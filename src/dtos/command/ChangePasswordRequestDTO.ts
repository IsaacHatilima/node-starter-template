export class ChangePasswordRequestDTO {
    readonly password: string;
    readonly token: string;

    private constructor(password: string, token: string) {
        this.password = password;
        this.token = token;
    }

    static fromParsed(input: {
        password: string;
        token: string;
    }): ChangePasswordRequestDTO {
        return new ChangePasswordRequestDTO(
            input.password.trim(),
            input.token.trim()
        );
    }
}
