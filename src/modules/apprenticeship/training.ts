/* ==========================================================
   REMADEF PLATFORM
   Apprenticeship Training
   File: src/modules/apprenticeship/training.ts
========================================================== */

import Events from "../../core/events";
import State from "../../core/state";
import API from "../../services/api";

import type {
    TrainingSession
} from "../../types/apprenticeship";

class ApprenticeshipTraining {

    private readonly STATE_KEY =
        "apprenticeship.training";

    private sessions: TrainingSession[] = [];

    async initialize(): Promise<void> {

        this.registerEvents();

        await this.refresh();

    }

    private registerEvents(): void {

        Events.on(

            "apprenticeship:reloadTraining",

            () => this.refresh()

        );

    }

    async refresh(): Promise<void> {

        const response =

            await API.apprenticeship.getTraining();

        this.sessions =

            response.data || [];

        State.set(

            this.STATE_KEY,

            this.sessions

        );

        Events.emit(

            "apprenticeship:trainingLoaded",

            this.sessions

        );

        this.render();

    }

    getSessions(): TrainingSession[] {

        return this.sessions;

    }

    private render(): void {

        if (!this.sessions.length) {

            this.renderEmptyState();

            return;

        }

        // Calendar View

        // Weekly Schedule

        // Monthly Schedule

        // Upcoming Classes

        // Online Classes

        // Physical Classes

        // Live Session Button

        // Download Materials

    }

    private renderEmptyState(): void {

        // No training scheduled

    }

}

export default new ApprenticeshipTraining();
