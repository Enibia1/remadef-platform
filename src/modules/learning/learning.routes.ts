/* ==========================================================
   REMADEF PLATFORM
   Learning Routes
   File: src/modules/learning/learning.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import LearningController from "./learning.controller";

class LearningRoutes {

    /* ======================================================
       REGISTER ROUTES
    ====================================================== */

    register(): void {

        /* ==================================================
           LEARNING HOME
        ================================================== */

        Router.register({

            path: ROUTES.LEARNING,

            name: "learning",

            protected: true,

            title: "Learning",

            onEnter: async () => {

                await LearningController.initialize();

            },

            onLeave: () => {

                LearningController.destroy();

            }

        });

        /* ==================================================
           COURSE DETAILS
        ================================================== */

        Router.register({

            path: "/html/course.html",

            name: "course",

            protected: true,

            title: "Course",

            onEnter: async () => {

                await LearningController.initialize();

            },

            onLeave: () => {

                LearningController.destroy();

            }

        });

        /* ==================================================
           LESSON VIEWER
        ================================================== */

        Router.register({

            path: "/html/lesson.html",

            name: "lesson",

            protected: true,

            title: "Lesson",

            onEnter: async () => {

                await LearningController.initialize();

            },

            onLeave: () => {

                LearningController.destroy();

            }

        });

        /* ==================================================
           MY COURSES
        ================================================== */

        Router.register({

            path: "/html/my-courses.html",

            name: "my-courses",

            protected: true,

            title: "My Courses",

            onEnter: async () => {

                await LearningController.initialize();

            },

            onLeave: () => {

                LearningController.destroy();

            }

        });

        /* ==================================================
           CERTIFICATES
        ================================================== */

        Router.register({

            path: "/html/certificates.html",

            name: "certificates",

            protected: true,

            title: "Certificates",

            onEnter: async () => {

                await LearningController.initialize();

            },

            onLeave: () => {

                LearningController.destroy();

            }

        });

    }

}

export default new LearningRoutes();
