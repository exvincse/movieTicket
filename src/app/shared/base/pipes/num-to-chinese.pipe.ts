import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'NumToChinese' })
/**
 * NumToChinesePipe
 */
export class NumToChinesePipe implements PipeTransform {
    private mapObj: any = {
        0: '零',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九'
    };

    private units: string[] = ['', '十', '百', '千', '萬', '十', '百', '千', '億', '十', '百', '千', '萬'];
    private newArray: string[] = []; // 整合後的新數組
    private isZero: boolean = false; // 判斷上一個添加的是否為零
    private resValue: string = ''; // 管道的返回值

    /**
     * transform
     * @param num num
     * @returns chinese
     */
    transform(num: number): string {
        this.newArray = [];
        if (!num || num <= 0) {
            return '';
        }
        const numArray = num.toString().split('').reverse();// 字符串分割後數據反轉
        for (let index = 0, j = numArray.length; index < j; index++) {
            const thisChineseNum = this.mapObj[numArray[index]];

            if (numArray[index] === '0') {
                const oval = this.isMultiple(index, thisChineseNum);
                this.newArray.push(oval);
            } else {
                numArray[index] = thisChineseNum + this.units[index];
                this.newArray.push(numArray[index]);
                this.isZero = false;
            }
        }

        if (this.newArray.length === 2) {
            this.newArray[0] = '十';
        }

        return this.newArray[0];
    }

    /**
     * 判斷當前index是否在萬、億，4和8的倍數
     * @param i index
     * @param val val
     * @returns unit
     */
    isMultiple(i: number, val: string): string {
        const y = i % 4;
        const x = i % 8;
        if (this.isZero) {
            // 前一位為零
            if (y === 0 && x !== 0) {
                // 是4的倍數取萬
                return '萬';
            } else if (i > 8 && x === 0) {
                // 是8的倍數取億
                return '億';
            } else {
                // 不正常請況返回空
                return '';
            }
        } else {
            // 第一次為零進入
            this.isZero = true;
            if (y === 0 && x !== 0) {
                // 是4的倍數取萬
                return '萬';
            } else if (i > 8 && x === 0) {
                // 是8的倍數取億
                return '億';
            } else {
                // 不正常請況返回空
                return val;
            }
        }
    }
};
