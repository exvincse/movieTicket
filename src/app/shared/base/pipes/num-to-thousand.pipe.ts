import { Pipe, PipeTransform } from '@angular/core';

/**
 * numToThousand
 * 數字format千分位
 */
@Pipe({
    name: 'numToThousand'
})
export class NumToThousandPipe implements PipeTransform {

    /**
     * Transforms number to thousand pipe
     * @param value 數字
     * @returns format thousand
     */
    transform(value: number) {
        const paramStr = value.toString();
        if (paramStr.length > 3) {
            return paramStr.replace(/(?=(?!^)(\d{3})+$)/g, ',');
        }
        return paramStr;
    }

}
