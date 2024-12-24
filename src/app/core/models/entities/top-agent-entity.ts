import { BaseApiSchema } from './base/base-api-schema';

export interface TopAgent {
    awardYear: string;
    accuPremium: number;
    accuInsurances: number;
    applicableDate: {
        start: string;
        end: string;
    };
}

/**
 * Top Agent 基本資料
 */
export interface TopAgentEntity extends BaseApiSchema {
    data: TopAgent;
}
