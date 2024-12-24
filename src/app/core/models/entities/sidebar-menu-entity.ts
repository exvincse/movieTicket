import { BaseApiSchema } from './base/base-api-schema';

/**
 * 全站-選單
 */
export interface SidebarMenu {
    functionName: string;
    functionCode: string;
    link?: string;
    isOpenNewWindow?: boolean;
    subLevels?: SidebarMenu[];
    isWebInSide?: boolean;
}

export interface SidebarMenuEntity extends BaseApiSchema {
    data: {
        items: SidebarMenu[]
    };
}
