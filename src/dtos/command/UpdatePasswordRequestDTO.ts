export class UpdatePasswordRequestDTO {
    readonly current_password: string;
    readonly password: string;
    readonly password_confirm: string;

    private constructor(current_password: string, password: string, password_confirm: string) {
        this.current_password = current_password;
        this.password = password;
        this.password_confirm = password_confirm;
    }

    static fromParsed(input: {
        current_password: string;
        password: string;
        password_confirm: string;
    }): UpdatePasswordRequestDTO {
        return new UpdatePasswordRequestDTO(
            input.current_password.trim(),
            input.password.trim(),
            input.password_confirm.trim()
        );
    }
}
