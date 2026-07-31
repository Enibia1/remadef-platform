/* ==========================================================
   REMADEF PLATFORM
   Escrow Service
   File: src/services/escrow.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Escrow,
    EscrowMilestone,
    EscrowParticipant,
    EscrowDispute,
    EscrowTimeline,
    EscrowFilter,
    CreateEscrowRequest,
    UpdateEscrowRequest,
    ReleaseFundsRequest,
    RaiseDisputeRequest,
    ResolveDisputeRequest
} from "../types/escrow";

class EscrowService {

    /* ======================================================
       ESCROW
    ====================================================== */

    getEscrows(
        page = 1,
        limit = 20,
        filter?: EscrowFilter
    ): Promise<ListResponse<Escrow>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        if (filter) {

            Object.entries(filter).forEach(([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null
                ) {

                    params.append(
                        key,
                        String(value)
                    );

                }

            });

        }

        return Client.get(

            `${ENDPOINTS.ESCROW.ROOT}?${params.toString()}`

        );

    }

    getEscrow(
        escrowId: string
    ): Promise<ApiResponse<Escrow>> {

        return Client.get(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}`

        );

    }

    create(
        data: CreateEscrowRequest
    ): Promise<ApiResponse<Escrow>> {

        return Client.post(

            ENDPOINTS.ESCROW.ROOT,

            data

        );

    }

    update(
        escrowId: string,
        data: UpdateEscrowRequest
    ): Promise<ApiResponse<Escrow>> {

        return Client.put(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}`,

            data

        );

    }

    cancel(
        escrowId: string
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/cancel`

        );

    }

    /* ======================================================
       PARTICIPANTS
    ====================================================== */

    getParticipants(
        escrowId: string
    ): Promise<ApiResponse<EscrowParticipant[]>> {

        return Client.get(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/participants`

        );

    }

    /* ======================================================
       MILESTONES
    ====================================================== */

    getMilestones(
        escrowId: string
    ): Promise<ApiResponse<EscrowMilestone[]>> {

        return Client.get(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/milestones`

        );

    }

    completeMilestone(
        escrowId: string,
        milestoneId: string
    ): Promise<ApiResponse<EscrowMilestone>> {

        return Client.patch(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/milestones/${encodeURIComponent(milestoneId)}`,

            {
                status: "completed"
            }

        );

    }

    /* ======================================================
       RELEASE
    ====================================================== */

    releaseFunds(
        escrowId: string,
        data: ReleaseFundsRequest
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/release`,

            data

        );

    }

    /* ======================================================
       DISPUTES
    ====================================================== */

    raiseDispute(
        escrowId: string,
        data: RaiseDisputeRequest
    ): Promise<ApiResponse<EscrowDispute>> {

        return Client.post(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/dispute`,

            data

        );

    }

    resolveDispute(
        escrowId: string,
        disputeId: string,
        data: ResolveDisputeRequest
    ): Promise<ApiResponse<EscrowDispute>> {

        return Client.patch(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/disputes/${encodeURIComponent(disputeId)}`,

            data

        );

    }

    getDisputes(
        escrowId: string
    ): Promise<ApiResponse<EscrowDispute[]>> {

        return Client.get(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/disputes`

        );

    }

    /* ======================================================
       TIMELINE
    ====================================================== */

    getTimeline(
        escrowId: string
    ): Promise<ApiResponse<EscrowTimeline[]>> {

        return Client.get(

            `${ENDPOINTS.ESCROW.ROOT}/${encodeURIComponent(escrowId)}/timeline`

        );

    }

}

export default new EscrowService();
