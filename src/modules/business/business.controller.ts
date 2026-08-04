/* ==========================================================
   REMADEF PLATFORM
   Business Controller
   File: src/modules/business/business.controller.ts
========================================================== */

import BusinessModule from "./business.module";
import BusinessView from "./business-view";

import Events from "../../core/events";

class BusinessController {

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

        await BusinessModule.initialize();

        BusinessView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* Refresh */

        document

            .querySelector("[data-business-refresh]")

            ?.addEventListener(

                "click",

                () => {

                    BusinessModule.refresh();

                }

            );

        /* Update Business */

        document

            .querySelector("[data-business-save]")

            ?.addEventListener(

                "click",

                async () => {

                    const data = {

                        name:

                            (

                                document.querySelector(

                                    "[data-business-name]"

                                ) as HTMLInputElement

                            )?.value,

                        description:

                            (

                                document.querySelector(

                                    "[data-business-description]"

                                ) as HTMLTextAreaElement

                            )?.value,

                        industry:

                            (

                                document.querySelector(

                                    "[data-business-industry]"

                                ) as HTMLInputElement

                            )?.value,

                        location:

                            (

                                document.querySelector(

                                    "[data-business-location]"

                                ) as HTMLInputElement

                            )?.value

                    };

                    await BusinessModule.update(

                        data

                    );

                }

            );

        /* Add Product */

        document

            .querySelector("[data-product-create]")

            ?.addEventListener(

                "click",

                async () => {

                    const product = {

                        name:

                            (

                                document.querySelector(

                                    "[data-product-name]"

                                ) as HTMLInputElement

                            )?.value,

                        price: Number(

                            (

                                document.querySelector(

                                    "[data-product-price]"

                                ) as HTMLInputElement

                            )?.value || 0

                        ),

                        description:

                            (

                                document.querySelector(

                                    "[data-product-description]"

                                ) as HTMLTextAreaElement

                            )?.value

                    };

                    await BusinessModule.createProduct(

                        product

                    );

                }

            );

        /* Add Service */

        document

            .querySelector("[data-service-create]")

            ?.addEventListener(

                "click",

                async () => {

                    const service = {

                        name:

                            (

                                document.querySelector(

                                    "[data-service-name]"

                                ) as HTMLInputElement

                            )?.value,

                        price: Number(

                            (

                                document.querySelector(

                                    "[data-service-price]"

                                ) as HTMLInputElement

                            )?.value || 0

                        ),

                        description:

                            (

                                document.querySelector(

                                    "[data-service-description]"

                                ) as HTMLTextAreaElement

                            )?.value

                    };

                    await BusinessModule.createService(

                        service

                    );

                }

            );

        /* Search */

        document

            .querySelector<HTMLInputElement>(

                "[data-business-search]"

            )

            ?.addEventListener(

                "input",

                async event => {

                    const query =

                        (

                            event.target as HTMLInputElement

                        ).value.trim();

                    await BusinessModule.search(

                        query

                    );

                }

            );

        /* Follow */

        document

            .querySelector("[data-business-follow]")

            ?.addEventListener(

                "click",

                async () => {

                    const businessId =

                        (

                            document.querySelector(

                                "[data-business-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!businessId) {

                        return;

                    }

                    await BusinessModule.follow(

                        businessId

                    );

                }

            );

        /* Unfollow */

        document

            .querySelector("[data-business-unfollow]")

            ?.addEventListener(

                "click",

                async () => {

                    const businessId =

                        (

                            document.querySelector(

                                "[data-business-id]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!businessId) {

                        return;

                    }

                    await BusinessModule.unfollow(

                        businessId

                    );

                }

            );

        /* Reply Review */

        document

            .querySelector("[data-review-reply]")

            ?.addEventListener(

                "click",

                async () => {

                    const reviewId =

                        (

                            document.querySelector(

                                "[data-review-id]"

                            ) as HTMLInputElement

                        )?.value;

                    const reply =

                        (

                            document.querySelector(

                                "[data-review-text]"

                            ) as HTMLTextAreaElement

                        )?.value;

                    if (

                        !reviewId ||

                        !reply

                    ) {

                        return;

                    }

                    await BusinessModule.replyToReview(

                        reviewId,

                        reply

                    );

                }

            );

        /* Product Selected */

        document

            .querySelectorAll(

                "[data-product-item]"

            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    () => {

                        Events.emit(

                            "business:productSelected",

                            element.getAttribute(

                                "data-product-id"

                            )

                        );

                    }

                );

            });

        /* Service Selected */

        document

            .querySelectorAll(

                "[data-service-item]"

            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    () => {

                        Events.emit(

                            "business:serviceSelected",

                            element.getAttribute(

                                "data-service-id"

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

export default new BusinessController();
