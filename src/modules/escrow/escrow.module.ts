/* ==========================================================
   REMADEF PLATFORM
   Escrow Module
   File: src/modules/escrow/escrow.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    Escrow,
    EscrowSummary,
    EscrowMilestone,
    EscrowDispute,
    EscrowTransaction

} from "../../types/escrow";

class EscrowModule {

    private readonly ESCROW_KEY =
        "escrow.data";

    private readonly SUMMARY_KEY =
        "escrow.summary";

    private readonly TRANSACTIONS_KEY =
        "escrow.transactions";

    private readonly MILESTONES_KEY =
        "escrow.milestones";

    private readonly DISPUTES_KEY =
        "escrow.disputes";

    private readonly CACHE_KEY =
        "escrow-cache";

    private loading = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restore();

        this.registerEvents();

        await this.refresh();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "escrow:refresh",

            () => this.refresh()

        );

        Events.on(

            "escrow:transactions",

            () => this.reloadTransactions()

        );

        Events.on(

            "escrow:milestones",

            () => this.reloadMilestones()

        );

        Events.on(

            "escrow:disputes",

            () => this.reloadDisputes()

        );

    }

    /* ======================================================
       DASHBOARD
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.escrow.getEscrow();

            const escrow =
                response.data as Escrow;

            State.set(

                this.ESCROW_KEY,

                escrow

            );

            Cache.set(

                this.CACHE_KEY,

                escrow

            );

            Events.emit(

                "escrow:loaded",

                escrow

            );

            await Promise.all([

                this.reloadSummary(),

                this.reloadTransactions(),

                this.reloadMilestones(),

                this.reloadDisputes()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       SUMMARY
    ====================================================== */

    async reloadSummary(): Promise<void> {

        const response =
            await API.escrow.getSummary();

        const summary =
            response.data as EscrowSummary;

        State.set(

            this.SUMMARY_KEY,

            summary

        );

        Events.emit(

            "escrow:summaryUpdated",

            summary

        );

    }

    /* ======================================================
       TRANSACTIONS
    ====================================================== */

    async reloadTransactions(): Promise<void> {

        const response =
            await API.escrow.getTransactions();

        const transactions =
            (response.data ?? []) as EscrowTransaction[];

        State.set(

            this.TRANSACTIONS_KEY,

            transactions

        );

        Events.emit(

            "escrow:transactionsUpdated",

            transactions

        );

    }

    /* ======================================================
       MILESTONES
    ====================================================== */

    async reloadMilestones(): Promise<void> {

        const response =
            await API.escrow.getMilestones();

        const milestones =
            (response.data ?? []) as EscrowMilestone[];

        State.set(

            this.MILESTONES_KEY,

            milestones

        );

        Events.emit(

            "escrow:milestonesUpdated",

            milestones

        );

    }

    /* ======================================================
       DISPUTES
    ====================================================== */

    async reloadDisputes(): Promise<void> {

        const response =
            await API.escrow.getDisputes();

        const disputes =
            (response.data ?? []) as EscrowDispute[];

        State.set(

            this.DISPUTES_KEY,

            disputes

        );

        Events.emit(

            "escrow:disputesUpdated",

            disputes

        );

    }

    /* ======================================================
       CREATE ESCROW
    ====================================================== */

    async create(
        data: Record<string, unknown>
    ): Promise<void> {

        await API.escrow.create(
            data
        );

        await this.refresh();

    }

    /* ======================================================
       UPDATE ESCROW
    ====================================================== */

    async update(
        escrowId: string,
        data: Record<string, unknown>
    ): Promise<void> {

        await API.escrow.update(
            escrowId,
            data
        );

        await this.refresh();

    }

    /* ======================================================
       RELEASE FUNDS
    ====================================================== */

    async releaseFunds(
        escrowId: string
    ): Promise<void> {

        await API.escrow.releaseFunds(
            escrowId
        );

        await this.refresh();

    }

    /* ======================================================
       CANCEL ESCROW
    ====================================================== */

    async cancel(
        escrowId: string
    ): Promise<void> {

        await API.escrow.cancel(
            escrowId
        );

        await this.refresh();

    }

    /* ======================================================
       DISPUTES
    ====================================================== */

    async openDispute(
        escrowId: string,
        reason: string
    ): Promise<void> {

        await API.escrow.openDispute({

            escrowId,

            reason

        });

        await this.reloadDisputes();

    }

    async resolveDispute(
        disputeId: string,
        resolution: string
    ): Promise<void> {

        await API.escrow.resolveDispute({

            disputeId,

            resolution

        });

        await this.reloadDisputes();

    }

    /* ======================================================
       MILESTONES
    ====================================================== */

    async approveMilestone(
        milestoneId: string
    ): Promise<void> {

        await API.escrow.approveMilestone(
            milestoneId
        );

        await this.reloadMilestones();

    }

    async rejectMilestone(
        milestoneId: string
    ): Promise<void> {

        await API.escrow.rejectMilestone(
            milestoneId
        );

        await this.reloadMilestones();

    }

    /* ======================================================
       SEARCH
    ====================================================== */

    async search(
        query: string
    ): Promise<void> {

        const response =
            await API.escrow.search(
                query
            );

        State.set(

            "escrow.search",

            response.data ?? []

        );

        Events.emit(

            "escrow:searchUpdated",

            response.data ?? []

        );

    }    /* ======================================================
       HELPERS
    ====================================================== */

    getEscrow(): Escrow | null {

        return (

            State.get(

                this.ESCROW_KEY

            ) || null

        );

    }

    getSummary(): EscrowSummary | null {

        return (

            State.get(

                this.SUMMARY_KEY

            ) || null

        );

    }

    getTransactions(): EscrowTransaction[] {

        return (

            State.get(

                this.TRANSACTIONS_KEY

            ) || []

        );

    }

    getMilestones(): EscrowMilestone[] {

        return (

            State.get(

                this.MILESTONES_KEY

            ) || []

        );

    }

    getDisputes(): EscrowDispute[] {

        return (

            State.get(

                this.DISPUTES_KEY

            ) || []

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached =

            Cache.get(

                this.CACHE_KEY

            );

        if (!cached) {

            return;

        }

        State.set(

            this.ESCROW_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.ESCROW_KEY

        );

        State.remove(

            this.SUMMARY_KEY

        );

        State.remove(

            this.TRANSACTIONS_KEY

        );

        State.remove(

            this.MILESTONES_KEY

        );

        State.remove(

            this.DISPUTES_KEY

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "escrow:cleared"

        );

    }

}

export default new EscrowModule();
