/* ==========================================================
   REMADEF PLATFORM
   Learning Controller
   File: src/modules/learning/learning.controller.ts
========================================================== */

import LearningModule from "./learning.module";
import LearningView from "./learning-view";

import Events from "../../core/events";

class LearningController {

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

        await LearningModule.initialize();

        LearningView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* Refresh */

        document

            .querySelector("[data-learning-refresh]")

            ?.addEventListener(

                "click",

                () => {

                    LearningModule.refresh();

                }

            );

        /* Search */

        document

            .querySelector<HTMLInputElement>(
                "[data-learning-search]"
            )

            ?.addEventListener(

                "input",

                async event => {

                    const query = (

                        event.target as HTMLInputElement

                    ).value.trim();

                    if (!query) {

                        return;

                    }

                    await LearningModule.searchCourses(
                        query
                    );

                }

            );

        /* Category */

        document

            .querySelectorAll(
                "[data-learning-category]"
            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    () => {

                        const category =
                            element.getAttribute(
                                "data-learning-category"
                            );

                        Events.emit(

                            "learning:categorySelected",

                            category

                        );

                    }

                );

            });

        /* Continue Learning */

        document

            .querySelectorAll(
                "[data-learning-continue]"
            )

            .forEach(button => {

                button.addEventListener(

                    "click",

                    () => {

                        const courseId =
                            button.getAttribute(
                                "data-course-id"
                            );

                        Events.emit(

                            "learning:continue",

                            courseId

                        );

                    }

                );

            });

        /* Bookmark */

        document

            .querySelectorAll(
                "[data-learning-bookmark]"
            )

            .forEach(button => {

                button.addEventListener(

                    "click",

                    async () => {

                        const courseId =
                            button.getAttribute(
                                "data-course-id"
                            );

                        if (!courseId) {

                            return;

                        }

                        await LearningModule.bookmarkCourse(
                            courseId
                        );

                    }

                );

            });

        /* Wishlist */

        document

            .querySelectorAll(
                "[data-learning-wishlist]"
            )

            .forEach(button => {

                button.addEventListener(

                    "click",

                    async () => {

                        const courseId =
                            button.getAttribute(
                                "data-course-id"
                            );

                        if (!courseId) {

                            return;

                        }

                        await LearningModule.addToWishlist(
                            courseId
                        );

                    }

                );

            });

        /* Review */

        document

            .querySelectorAll(
                "[data-learning-review]"
            )

            .forEach(button => {

                button.addEventListener(

                    "click",

                    () => {

                        Events.emit(

                            "learning:review"

                        );

                    }

                );

            });

        /* Lesson Complete */

        document

            .querySelectorAll(
                "[data-complete-lesson]"
            )

            .forEach(button => {

                button.addEventListener(

                    "click",

                    async () => {

                        const lessonId =
                            button.getAttribute(
                                "data-lesson-id"
                            );

                        if (!lessonId) {

                            return;

                        }

                        await LearningModule.completeLesson(
                            lessonId
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

export default new LearningController();
