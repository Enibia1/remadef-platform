/* ==========================================================
   REMADEF PLATFORM
   Jobs & Gigs Controller
   File: src/modules/jobs/jobs.controller.ts
========================================================== */

import JobsModule from "./jobs.module";
import JobsView from "./jobs-view";

import Events from "../../core/events";

class JobsController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindUI();

        await JobsModule.initialize();

        JobsView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* Refresh */

        document

            .querySelector("[data-jobs-refresh]")

            ?.addEventListener(

                "click",

                () => {

                    JobsModule.refresh();

                }

            );

        /* Search */

        document

            .querySelector<HTMLInputElement>(

                "[data-jobs-search]"

            )

            ?.addEventListener(

                "input",

                async event => {

                    const query =

                        (

                            event.target as HTMLInputElement

                        ).value.trim();

                    await JobsModule.search(

                        query

                    );

                }

            );

        /* Filter */

        document

            .querySelector(

                "[data-jobs-filter]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const filters = {

                        category:

                            (

                                document.querySelector(

                                    "[data-filter-category]"

                                ) as HTMLSelectElement

                            )?.value,

                        location:

                            (

                                document.querySelector(

                                    "[data-filter-location]"

                                ) as HTMLInputElement

                            )?.value,

                        jobType:

                            (

                                document.querySelector(

                                    "[data-filter-type]"

                                ) as HTMLSelectElement

                            )?.value,

                        salary:

                            (

                                document.querySelector(

                                    "[data-filter-salary]"

                                ) as HTMLInputElement

                            )?.value

                    };

                    await JobsModule.filter(

                        filters

                    );

                }

            );

        /* Apply */

        document

            .querySelector(

                "[data-job-apply]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const jobId =

                        (

                            document.querySelector(

                                "[data-job-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!jobId) {

                        return;

                    }

                    await JobsModule.apply(

                        jobId,

                        {}

                    );

                }

            );

        /* Save */

        document

            .querySelector(

                "[data-job-save]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const jobId =

                        (

                            document.querySelector(

                                "[data-job-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!jobId) {

                        return;

                    }

                    await JobsModule.saveJob(

                        jobId

                    );

                }

            );

        /* Unsave */

        document

            .querySelector(

                "[data-job-unsave]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const jobId =

                        (

                            document.querySelector(

                                "[data-job-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!jobId) {

                        return;

                    }

                    await JobsModule.unsaveJob(

                        jobId

                    );

                }

            );

        /* Withdraw */

        document

            .querySelector(

                "[data-withdraw-application]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const applicationId =

                        (

                            document.querySelector(

                                "[data-application-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!applicationId) {

                        return;

                    }

                    await JobsModule.withdrawApplication(

                        applicationId

                    );

                }

            );

        /* Follow Employer */

        document

            .querySelector(

                "[data-follow-employer]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const employerId =

                        (

                            document.querySelector(

                                "[data-employer-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!employerId) {

                        return;

                    }

                    await JobsModule.followEmployer(

                        employerId

                    );

                }

            );

        /* Unfollow Employer */

        document

            .querySelector(

                "[data-unfollow-employer]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const employerId =

                        (

                            document.querySelector(

                                "[data-employer-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!employerId) {

                        return;

                    }

                    await JobsModule.unfollowEmployer(

                        employerId

                    );

                }

            );

        /* Report Job */

        document

            .querySelector(

                "[data-report-job]"

            )

            ?.addEventListener(

                "click",

                async () => {

                    const jobId =

                        (

                            document.querySelector(

                                "[data-job-id]"

                            ) as HTMLInputElement

                        )?.value;

                    const reason =

                        (

                            document.querySelector(

                                "[data-report-reason]"

                            ) as HTMLTextAreaElement

                        )?.value;

                    if (

                        !jobId ||

                        !reason

                    ) {

                        return;

                    }

                    await JobsModule.reportJob(

                        jobId,

                        reason

                    );

                }

            );

        /* Job Selected */

        document

            .querySelectorAll(

                "[data-job-item]"

            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    () => {

                        Events.emit(

                            "jobs:selected",

                            element.getAttribute(

                                "data-job-id"

                            )

                        );

                    }

                );

            });

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new JobsController();
