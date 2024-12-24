import { Pipe, PipeTransform } from '@angular/core';
import { ceToRoc } from '@core/utils/ce-to-roc';

/**
 * CeToRocPipe
 * 西元年轉民國年
 */
@Pipe({
    name: 'ceYearToRoc'
})
export class CeToRocPipe implements PipeTransform {

    /**
     * Transforms ce to roc pipe
     * @param ce 西元年 yyyy-MM-dd
     * @returns roc 民國年
     */
    transform(ce: string): string {
        return ceToRoc(ce);
    }
}
