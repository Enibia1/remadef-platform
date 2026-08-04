/* ==========================================================
   REMADEF PLATFORM
   Jobs & Gigs Routes
   File: src/modules/jobs/jobs.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import JobsController from "./jobs.controller";

class JobsRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           JOBS HOME
        ================================================== */

        Router.register({

            path: ROUTES.JOBS,

            name: "jobs",

            protected: true,

            title: "Jobs & Gigs",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           JOB DETAILS
        ================================================== */

        Router.register({

            path: "/html/job-details.html",

            name: "job-details",

            protected: true,

            title: "Job Details",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           CREATE JOB
        ================================================== */

        Router.register({

            path: "/html/create-job.html",

            name: "create-job",

            protected: true,

            title: "Create Job",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           MY JOBS
        ================================================== */

        Router.register({

            path: "/html/my-jobs.html",

            name: "my-jobs",

            protected: true,

            title: "My Jobs",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           SAVED JOBS
        ================================================== */

        Router.register({

            path: "/html/saved-jobs.html",

            name: "saved-jobs",

            protected: true,

            title: "Saved Jobs",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           APPLICATIONS
        ================================================== */

        Router.register({

            path: "/html/job-applications.html",

            name: "job-applications",

            protected: true,

            title: "My Applications",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           EMPLOYERS
        ================================================== */

        Router.register({

            path: "/html/employers.html",

            name: "employers",

            protected: true,

            title: "Employers",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           CATEGORIES
        ================================================== */

        Router.register({

            path: "/html/job-categories.html",

            name: "job-categories",

            protected: true,

            title: "Job Categories",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           RECOMMENDED JOBS
        ================================================== */

        Router.register({

            path: "/html/recommended-jobs.html",

            name: "recommended-jobs",

            protected: true,

            title: "Recommended Jobs",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

        /* ==================================================
           JOB ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/job-analytics.html",

            name: "job-analytics",

            protected: true,

            title: "Job Analytics",

            onEnter: async () => {

                await JobsController.initialize();

            },

            onLeave: () => {

                JobsController.destroy();

            }

        });

    }

}

export default new JobsRoutes();
