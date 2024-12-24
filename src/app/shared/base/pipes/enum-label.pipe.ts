import { Pipe, PipeTransform } from '@angular/core';

/**
 * 取得enum對應的文字
 */
@Pipe({
    name: 'enumLabel'
})
export class EnumLabelPipe implements PipeTransform {

    /**
     * Transforms mapping pipe
     * @param value 輸入
     * @param mapping 用於轉換的物件陣列
     * @returns 轉換後的值
     */
    transform(value: any, ...mapping: object[]): any {
        return mapping.reduce((preValue, obj) => obj[preValue], value);
    }
}
