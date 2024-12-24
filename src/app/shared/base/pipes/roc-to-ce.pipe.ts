import { Pipe, PipeTransform } from '@angular/core';
import { rocToCe } from '@core/utils/roc-to-ce';

/**
 * RocToCePipe
 * 民國年轉西元年
 */
@Pipe({
    name: 'rocYearToCe'
})
export class RocToCePipe implements PipeTransform {

    /**
     * Transforms roc to ce pipe
     * @param roc 民國年 yyy-MM-dd
     * @returns ce 西元年
     */
    transform(roc: string): string {
        return rocToCe(roc);
    }
}
