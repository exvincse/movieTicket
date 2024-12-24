import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * DateToWeekDayPipe
 * 取的日期星期一 ~ 日
 */
@Pipe({
    name: 'dateToWeekDay'
})
export class DateToWeekDayPipe implements PipeTransform {

    /**
     * Transforms date to week day pipe
     * @param date 西元年 yyyy-MM-dd
     * @returns 星期一 ~ 日
     */
    transform(date: string): number {
        return moment(date).weekday();
    }
}
