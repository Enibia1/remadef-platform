/* ==========================================================
   REMADEF PLATFORM
   Core Authentication
   File: src/core/auth.ts

   PURPOSE
   ----------------------------------------------------------
   Central authentication manager.

   Handles:

   • Login state
   • User session
   • Token storage
   • Profile storage
   • Logout
   • Authorization helpers

   Every module should use this file.

========================================================== */

import Storage from "./storage";

import ROUTES from "../config/routes";

import type {

    User,

    Profile

} from "../types";

const USER_KEY = "remadef_user";

const PROFILE_KEY = "remadef_profile";

const TOKEN_KEY = "remadef_token";

class Auth {

    /* ======================================================
       TOKEN
    ====================================================== */

    getToken(): string | null {

        return Storage.get(TOKEN_KEY);

    }

    setToken(

        token: string

    ): void {

        Storage.set(

            TOKEN_KEY,

            token

        );

    }

    clearToken(): void {

        Storage.remove(

            TOKEN_KEY

        );

    }

    /* ======================================================
       USER
    ====================================================== */

    getUser(): User | null {

        return Storage.get<User>(

            USER_KEY

        );

    }

    setUser(

        user: User

    ): void {

        Storage.set(

            USER_KEY,

            user

        );

    }

    clearUser(): void {

        Storage.remove(

            USER_KEY

        );

    }

    /* ======================================================
       PROFILE
    ====================================================== */

    getProfile(): Profile | null {

        return Storage.get<Profile>(

            PROFILE_KEY

        );

    }

    setProfile(

        profile: Profile

    ): void {

        Storage.set(

            PROFILE_KEY,

            profile

        );

    }

    clearProfile(): void {

        Storage.remove(

            PROFILE_KEY

        );

    }

    /* ======================================================
       SESSION
    ====================================================== */

    isAuthenticated(): boolean {

        return !!this.getToken();

    }

    hasProfile(): boolean {

        return !!this.getProfile();

    }

    /* ======================================================
       LOGIN
    ====================================================== */

    login(

        token: string,

        user: User,

        profile?: Profile

    ): void {

        this.setToken(

            token

        );

        this.setUser(

            user

        );

        if (

            profile

        ) {

            this.setProfile(

                profile

            );

        }

    }

    /* ======================================================
       LOGOUT
    ====================================================== */

    logout(

        redirect = true

    ): void {

        this.clearToken();

        this.clearUser();

        this.clearProfile();

        if (

            redirect

        ) {

            window.location.href =

                ROUTES.LOGIN;

        }

    }

    /* ======================================================
       PROFILE COMPLETION
    ====================================================== */

    needsProfileCompletion(): boolean {

        const profile =

            this.getProfile();

        if (

            !profile

        ) {

            return true;

        }

        return (

            profile.completion < 100

        );

    }

    /* ======================================================
       ROLE
    ====================================================== */

    hasRole(

        role: string

    ): boolean {

        const user =

            this.getUser();

        if (

            !user

        ) {

            return false;

        }

        return user.roles.includes(

            role as never

        );

    }

}

export default new Auth();
