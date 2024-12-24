import { Pipe, PipeTransform } from '@angular/core';

interface Keyvalue {
    key: number | string;
    value: number | string;
}

/**
 * 將enum object 轉換固定格式物件
 */
@Pipe({
    name: 'enumKeyvalue'
})
export class EnumKeyValuePipe implements PipeTransform {

    /**
     * Transforms enum keyvalue pipe
     * @param enumObj enum object
     * @returns 轉換後的物件陣列
     */
    transform(enumObj: object): Array<Keyvalue> {
        const result = Object.keys(enumObj).filter(e => (e.constructor === String && isNaN(+e)))
            .map(o => {
                return { key: o, value: enumObj[o] };
            });

        return result;
    }
}
