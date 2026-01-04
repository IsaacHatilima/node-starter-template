import {toTitleCase} from "../../utils/string";

export class UpdateProfileRequestDTO {
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;

    private constructor(first_name: string, last_name: string, email: string) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }

    static fromParsed(input: {
        first_name: string;
        last_name: string;
        email: string;
    }): UpdateProfileRequestDTO {
        return new UpdateProfileRequestDTO(
            toTitleCase(input.first_name.trim()),
            toTitleCase(input.last_name.trim()),
            input.email.trim().toLowerCase()
        );
    }
}
