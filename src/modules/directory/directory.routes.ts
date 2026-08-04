/* ==========================================================
   REMADEF PLATFORM
   Directory Routes
   File: src/modules/directory/directory.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import DirectoryController from "./directory.controller";

class DirectoryRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           DIRECTORY HOME
        ================================================== */

        Router.register({

            path: ROUTES.DIRECTORY,

            name: "directory",

            protected: true,

            title: "Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           STUDENTS
        ================================================== */

        Router.register({

            path: "/html/directory-students.html",

            name: "directory-students",

            protected: true,

            title: "Students Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           APPRENTICES
        ================================================== */

        Router.register({

            path: "/html/directory-apprentices.html",

            name: "directory-apprentices",

            protected: true,

            title: "Apprentices Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           BUSINESSES
        ================================================== */

        Router.register({

            path: "/html/directory-businesses.html",

            name: "directory-businesses",

            protected: true,

            title: "Businesses Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           EMPLOYERS
        ================================================== */

        Router.register({

            path: "/html/directory-employers.html",

            name: "directory-employers",

            protected: true,

            title: "Employers Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           PROFESSIONALS
        ================================================== */

        Router.register({

            path: "/html/directory-professionals.html",

            name: "directory-professionals",

            protected: true,

            title: "Professionals Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           CREATORS
        ================================================== */

        Router.register({

            path: "/html/directory-creators.html",

            name: "directory-creators",

            protected: true,

            title: "Creators Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           ORGANIZATIONS
        ================================================== */

        Router.register({

            path: "/html/directory-organizations.html",

            name: "directory-organizations",

            protected: true,

            title: "Organizations Directory",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           SERVICE PROVIDERS
        ================================================== */

        Router.register({

            path: "/html/directory-services.html",

            name: "directory-services",

            protected: true,

            title: "Service Providers",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           FEATURED
        ================================================== */

        Router.register({

            path: "/html/directory-featured.html",

            name: "directory-featured",

            protected: true,

            title: "Featured Profiles",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           NEARBY
        ================================================== */

        Router.register({

            path: "/html/directory-nearby.html",

            name: "directory-nearby",

            protected: true,

            title: "Nearby",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           RECOMMENDATIONS
        ================================================== */

        Router.register({

            path: "/html/directory-recommendations.html",

            name: "directory-recommendations",

            protected: true,

            title: "Recommended For You",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           FAVORITES
        ================================================== */

        Router.register({

            path: "/html/directory-favorites.html",

            name: "directory-favorites",

            protected: true,

            title: "Favorite Profiles",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

        /* ==================================================
           RECENT
        ================================================== */

        Router.register({

            path: "/html/directory-recent.html",

            name: "directory-recent",

            protected: true,

            title: "Recently Viewed",

            onEnter: async () => {

                await DirectoryController.initialize();

            },

            onLeave: () => {

                DirectoryController.destroy();

            }

        });

    }

}

export default new DirectoryRoutes();

