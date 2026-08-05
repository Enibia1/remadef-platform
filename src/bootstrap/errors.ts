/* ==========================================================
   REMADEF PLATFORM
   Error Bootstrap
   File: src/bootstrap/errors.ts
========================================================== */

import ErrorBoundary from "../core/error-boundary";

export function initializeErrors(): void {

    ErrorBoundary.init();

}

export default initializeErrors;
