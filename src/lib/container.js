import {RegisterService} from "../services/auth/RegisterService.js";
import {MeService} from "../services/auth/MeService.js";
import {LoginService} from "../services/auth/LoginService.js";
import {EmailVerificationService} from "../services/auth/EmailVerificationService.js";
import {RefreshTokenService} from "../services/auth/RefreshTokenService.js";
import {LogoutService} from "../services/auth/LogoutService.js";
import {ForgotPasswordService} from "../services/auth/ForgotPasswordService.js";
import {ForgotPasswordTokenCheckerService} from "../services/auth/ForgotPasswordTokenCheckerService.js";
import {ChangePasswordService} from "../services/auth/ChangePasswordService.js";
import {UpdatePasswordService} from "../services/settings/UpdatePasswordService.js";
import {UpdateProfileService} from "../services/settings/UpdateProfileService.js";
import {DeleteAccountService} from "../services/settings/DeleteAccountService.js";
import {TwoFactorService} from "../services/settings/TwoFactorService.js";
import {TwoFactorChallengeService} from "../services/auth/TwoFactorChallengeService.js";
import {GoogleLoginService} from "../services/auth/GoogleLoginService.js";

const services = {
    registerService: RegisterService,
    loginService: LoginService,
    meService: MeService,
    emailVerificationService: EmailVerificationService,
    refreshTokenService: RefreshTokenService,
    logoutService: LogoutService,
    forgotPasswordService: ForgotPasswordService,
    forgotPasswordTokenCheckerService: ForgotPasswordTokenCheckerService,
    changePasswordService: ChangePasswordService,
    updatePasswordService: UpdatePasswordService,
    updateProfileService: UpdateProfileService,
    deleteAccountService: DeleteAccountService,
    twoFactorService: TwoFactorService,
    twoFactorChallengeService: TwoFactorChallengeService,
    googleLoginService: GoogleLoginService,
};

const singletons = {};

export const container = new Proxy(
    {},
    {
        get(_, key) {
            const ServiceClass = services[key];
            if (!ServiceClass) return undefined;

            if (!singletons[key]) {
                singletons[key] = new ServiceClass();
            }
            return singletons[key];
        },
    }
);
