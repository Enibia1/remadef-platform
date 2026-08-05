/* ==========================================================
   REMADEF PLATFORM
   Session Bootstrap
   File: src/bootstrap/session.ts
========================================================== */

import SessionRestore from "../core/session-restore";

export async function initializeSession(): Promise<void> {

    await SessionRestore.restore();

}

export default initializeSession;
