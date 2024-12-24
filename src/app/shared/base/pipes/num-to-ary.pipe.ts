import { Pipe, PipeTransform } from '@angular/core';

/**
 * 數字轉陣列
 */
@Pipe({
    name: 'numToAry'
})
export class NumToAryPipe implements PipeTransform {

    /**
     * Transforms num to ary pipe
     * @param length 陣列長度
     * @param start 起始值
     * @param step 數字間隔
     * @returns array
     */
    transform(length: number | string, start: number = 1, step: number = 1): number[] {
        return Array(+length).fill(0).map((e, i) => start + step * i);
    }

}
