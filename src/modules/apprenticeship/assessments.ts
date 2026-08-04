/* ==========================================================
   REMADEF PLATFORM
   Apprenticeship Assessments
   File: src/modules/apprenticeship/assessments.ts
========================================================== */

import API from "../../services/api";
import State from "../../core/state";
import Events from "../../core/events";

import type {
    Assessment,
    AssessmentResult
} from "../../types/apprenticeship";

class ApprenticeshipAssessments {

    private readonly STATE_KEY =
        "apprenticeship.assessments";

    private assessments: Assessment[] = [];

    async initialize(): Promise<void> {

        this.registerEvents();

        await this.refresh();

    }

    private registerEvents(): void {

        Events.on(

            "apprenticeship:reloadAssessments",

            () => this.refresh()

        );

    }

    async refresh(): Promise<void> {

        const response =

            await API.apprenticeship.getAssessments();

        this.assessments =
            response.data || [];

        State.set(

            this.STATE_KEY,

            this.assessments

        );

        Events.emit(

            "apprenticeship:assessmentsLoaded",

            this.assessments

        );

        this.render();

    }

    async submit(

        assessmentId: string,

        answers: Record<string, unknown>

    ): Promise<AssessmentResult> {

        const response =

            await API.apprenticeship.submitAssessment(

                assessmentId,

                answers

            );

        await this.refresh();

        return response.data;

    }

    private render(): void {

        if (!this.assessments.length) {

            this.renderEmptyState();

            return;

        }

        // Assessment cards

        // Quiz

        // Practical

        // Assignment

        // Due date

        // Attempts

        // Score

        // Pass / Fail

    }

    private renderEmptyState(): void {

        // No assessments available

    }

}

export default new ApprenticeshipAssessments();
