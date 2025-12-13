function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is missing`);
    }
    return value;
}

function optional<T extends string>(name: string, fallback: T): string {
    return process.env[name] ?? fallback;
}

export const env = {
    APP_NAME: optional("APP_NAME", "Auth API"),
    APP_KEY: required("APP_KEY"),
    APP_URL: required("APP_URL"),
    NODE_ENV: optional("NODE_ENV", "local"),
    GOOGLE_CLIENT_ID: required("GOOGLE_CLIENT_ID"),
    JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
    JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),


    PORT: optional("PORT", "3000"),
    SWAGGER_ENABLED: optional("SWAGGER_ENABLED", "false"),

    JWT_ACCESS_EXPIRES_IN: optional("JWT_ACCESS_EXPIRES_IN", "120m"),
    JWT_REFRESH_EXPIRES_IN: optional("JWT_REFRESH_EXPIRES_IN", "7d"),

    // add more as needed...
};
