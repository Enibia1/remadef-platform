/* ==========================================================
   REMADEF PLATFORM
   Router Guards
   File: src/router/guards.ts

   Responsibility
   ----------------------------------------------------------
   • Authentication Guards
   • Guest Guards
   • Role Guards
   • Permission Guards
   • Route Protection
========================================================== */

import Session from "../core/session";
import EventBus from "../core/events";
import History from "./history";

export interface RouteGuardContext {
    path: string;
    from?: string;
    meta?: Record<string, unknown>;
}

export interface GuardResult {

    allowed: boolean;

    redirect?: string;

    reason?: string;

}

export type RouteGuard = (

    context: RouteGuardContext

) => Promise<GuardResult> | GuardResult;

class GuardManager {

    private guards = new Map<string, RouteGuard>();

    /* ======================================================
       REGISTER
    ====================================================== */

    register(
        name: string,
        guard: RouteGuard
    ): void {

        this.guards.set(
            name,
            guard
        );

    }

    /* ======================================================
       REMOVE
    ====================================================== */

    remove(
        name: string
    ): void {

        this.guards.delete(
            name
        );

    }

    /* ======================================================
       GET
    ====================================================== */

    get(
        name: string
    ): RouteGuard | undefined {

        return this.guards.get(
            name
        );

    }

    /* ======================================================
       EXISTS
    ====================================================== */

    has(
        name: string
    ): boolean {

        return this.guards.has(
            name
        );

    }

    /* ======================================================
       AUTHENTICATED
    ====================================================== */

    registerAuthenticationGuard(): void {

        this.register(

            "authenticated",

            async (context) => {

                const authenticated =
                    Session.isAuthenticated();

                if (authenticated) {

                    return {
                        allowed: true
                    };

                }

                EventBus.emit(
                    "guard:authentication:failed",
                    context
                );

                return {

                    allowed: false,

                    redirect: "/login",

                    reason:
                        "Authentication required."

                };

            }

        );

    }

    /* ======================================================
       GUEST
    ====================================================== */

    registerGuestGuard(): void {

        this.register(

            "guest",

            async (context) => {

                const authenticated =
                    Session.isAuthenticated();

                if (!authenticated) {

                    return {
                        allowed: true
                    };

                }

                EventBus.emit(
                    "guard:guest:blocked",
                    context
                );

                return {

                    allowed: false,

                    redirect: "/home",

                    reason:
                        "Already authenticated."

                };

            }

        );

    }

    /* ======================================================
       REDIRECT
    ====================================================== */

    redirect(
        path: string
    ): void {

        History.replace(path);

    }

}

const Guards =
    new GuardManager();

/* ==========================================================
   DEFAULT GUARDS
========================================================== */

Guards.registerAuthenticationGuard();

Guards.registerGuestGuard();

export default Guards;

/* ==========================================================
   REMADEF PLATFORM
   Router Guards
   File: src/router/guards.ts

   PART 2
   Role Guards • Permission Guards • Custom Guards
========================================================== */

import User from "../core/user";

/* ==========================================================
   ROLE GUARDS
========================================================== */

declare module "./guards" {
    interface GuardManager {}
}

class RolePermissionExtension {

    constructor(
        private manager: typeof Guards
    ) {}

    /* ======================================================
       ROLE GUARD
    ====================================================== */

    registerRoleGuard(
        name: string,
        roles: string[]
    ): void {

        this.manager.register(

            name,

            async (context) => {

                const currentUser =
                    User.getCurrent();

                if (!currentUser) {

                    return {

                        allowed: false,

                        redirect: "/login",

                        reason:
                            "No authenticated user."

                    };

                }

                const userRole =
                    currentUser.role;

                const allowed =
                    roles.includes(userRole);

                if (!allowed) {

                    EventBus.emit(
                        "guard:role:denied",
                        {
                            ...context,
                            role: userRole,
                            required: roles
                        }
                    );

                    return {

                        allowed: false,

                        redirect: "/403",

                        reason:
                            "Insufficient role."

                    };

                }

                return {

                    allowed: true

                };

            }

        );

    }

    /* ======================================================
       PERMISSION GUARD
    ====================================================== */

    registerPermissionGuard(

        name: string,

        permissions: string[]

    ): void {

        this.manager.register(

            name,

            async (context) => {

                const currentUser =
                    User.getCurrent();

                if (!currentUser) {

                    return {

                        allowed: false,

                        redirect: "/login"

                    };

                }

                const userPermissions =
                    currentUser.permissions ??
                    [];

                const allowed =
                    permissions.every(

                        permission =>

                            userPermissions.includes(
                                permission
                            )

                    );

                if (!allowed) {

                    EventBus.emit(

                        "guard:permission:denied",

                        {

                            ...context,

                            required:
                                permissions

                        }

                    );

                    return {

                        allowed: false,

                        redirect: "/403",

                        reason:
                            "Permission denied."

                    };

                }

                return {

                    allowed: true

                };

            }

        );

    }

    /* ======================================================
       CUSTOM CALLBACK GUARD
    ====================================================== */

    registerCustom(

        name: string,

        callback: RouteGuard

    ): void {

        this.manager.register(

            name,

            callback

        );

    }

    /* ======================================================
       REMOVE
    ====================================================== */

    unregister(

        name: string

    ): void {

        this.manager.remove(
            name
        );

    }

}

export const GuardExtensions =
    new RolePermissionExtension(
        Guards
    );

/* ==========================================================
   DEFAULT ROLE GUARDS
========================================================== */

GuardExtensions.registerRoleGuard(
    "admin",
    ["admin"]
);

GuardExtensions.registerRoleGuard(
    "moderator",
    [
        "admin",
        "moderator"
    ]
);

GuardExtensions.registerRoleGuard(
    "creator",
    [
        "creator",
        "admin"
    ]
);

GuardExtensions.registerRoleGuard(
    "business",
    [
        "business",
        "admin"
    ]
); 

/* ==========================================================
   REMADEF PLATFORM
   Router Guards
   File: src/router/guards.ts

   PART 3
   Guard Execution Pipeline
========================================================== */

export interface ExecuteGuardsOptions {

    path: string;

    guards: string[];

    from?: string;

    meta?: Record<string, unknown>;

}

export interface ExecuteGuardsResult {

    allowed: boolean;

    redirect?: string;

    failedGuard?: string;

    reason?: string;

}

/* ==========================================================
   EXECUTE GUARD PIPELINE
========================================================== */

export async function executeGuards(

    options: ExecuteGuardsOptions

): Promise<ExecuteGuardsResult> {

    const context: RouteGuardContext = {

        path: options.path,

        from: options.from,

        meta: options.meta

    };

    EventBus.emit(

        "guards:start",

        context

    );

    for (const guardName of options.guards) {

        const guard = Guards.get(guardName);

        if (!guard) {

            console.warn(

                `Guard "${guardName}" not registered.`

            );

            continue;

        }

        EventBus.emit(

            "guard:before",

            {

                guard: guardName,

                context

            }

        );

        const result = await guard(context);

        EventBus.emit(

            "guard:after",

            {

                guard: guardName,

                result

            }

        );

        if (!result.allowed) {

            if (result.redirect) {

                Guards.redirect(

                    result.redirect

                );

            }

            EventBus.emit(

                "guards:failed",

                {

                    guard: guardName,

                    result

                }

            );

            return {

                allowed: false,

                redirect: result.redirect,

                failedGuard: guardName,

                reason: result.reason

            };

        }

    }

    EventBus.emit(

        "guards:passed",

        context

    );

    return {

        allowed: true

    };

}

/* ==========================================================
   CHECK SINGLE GUARD
========================================================== */

export async function canActivate(

    guardName: string,

    context: RouteGuardContext

): Promise<boolean> {

    const guard = Guards.get(

        guardName

    );

    if (!guard) {

        return true;

    }

    const result = await guard(

        context

    );

    return result.allowed;

}

/* ==========================================================
   CHECK MULTIPLE GUARDS
========================================================== */

export async function canActivateAll(

    guardNames: string[],

    context: RouteGuardContext

): Promise<boolean> {

    for (const name of guardNames) {

        const allowed = await canActivate(

            name,

            context

        );

        if (!allowed) {

            return false;

        }

    }

    return true;

}

/* ==========================================================
   CLEAR ALL GUARDS
========================================================== */

export function resetGuards(): void {

    Guards.remove("authenticated");

    Guards.remove("guest");

}

/* ==========================================================
   EXPORTS
========================================================== */

export {

    Guards

};
