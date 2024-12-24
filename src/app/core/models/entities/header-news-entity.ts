import { BaseApiSchema } from './base/base-api-schema';

export interface HeaderNews {
    policyUnreadTotal: number;
    companyUnreadTotal: number;
    noteUnreadTotal: number;
    coOrganizerUnreadTotal: number;
}

/**
 * Header提醒數量
 */
export interface HeaderNewsEntity extends BaseApiSchema {
    data: HeaderNews;
}
