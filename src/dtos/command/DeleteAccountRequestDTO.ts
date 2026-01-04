export class DeleteAccountRequestDTO {
    readonly password: string;

    private constructor(password: string) {
        this.password = password;
    }

    static fromParsed(input: {
        password: string;
    }): DeleteAccountRequestDTO {
        return new DeleteAccountRequestDTO(
            input.password.trim()
        );
    }
}
