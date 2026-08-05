/* ==========================================================
   REMADEF PLATFORM
   Session Restore
   File: src/core/session-restore.ts
========================================================== */

import Session from "./session";
import EventBus from "./events";
import Logger from "../utils/logger";

class SessionRestore {

    private restored = false;

    /* ======================================================
       RESTORE SESSION
    ====================================================== */

    async restore(): Promise<boolean> {

        if (this.restored) {
            return true;
        }

        try {

            Logger.info(
                "[SessionRestore] Restoring session..."
            );

            const success =
                await Session.restore();

            this.restored = success;

            EventBus.emit(
                success
                    ? "session:restored"
                    : "session:not-found"
            );

            return success;

        } catch (error) {

            Logger.error(
                "[SessionRestore] Failed.",
                error
            );

            EventBus.emit(
                "session:error",
                error
            );

            return false;

        }

    }

    /* ======================================================
       STATUS
    ====================================================== */

    isRestored(): boolean {

        return this.restored;

    }

}

export default new SessionRestore();
