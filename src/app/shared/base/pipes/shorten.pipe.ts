import { PipeTransform, Pipe } from '@angular/core';

/**
 * 將日期跟時間分二排放
 */
@Pipe({ name: 'shorten' })
export class ShortenPipe implements PipeTransform {

    /**
     *  Transforms shorten pipe
     * @param value 輸入
     * @param len 長度
     * @returns 轉換後的值
     */
    transform(value: any, len: number) {

        if (value === undefined || value === '') {
            return '';
        }

        if (len === undefined || len === 0) {
            return value;
        }

        const shortText = value.substr(0, len);
        return shortText + '...';

    }

}
