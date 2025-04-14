/* eslint-disable @typescript-eslint/no-dupe-class-members */
/* eslint-disable no-underscore-dangle */
import { CommonModule } from "@angular/common";
import {
    ChangeDetectorRef,
    Component, EventEmitter, Input, Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { StopPropagationDirective } from "../../directives/stop-propagation/stop-propagation.directive";

/**
 * PagerComponent
 */
@Component({
    selector: "app-pager",
    standalone: true,
    imports: [FormsModule, CommonModule, StopPropagationDirective],
    templateUrl: "./pager.component.html",
    styleUrl: "./pager.component.scss"
})
export class PagerComponent {
    @Output() changePageEmitter = new EventEmitter<any>();

    /**
     * 總頁數
     * @returns total page
     */
    @Input()
    get total() {
        return this._total;
    }

    /**
     * Sets total
     */
    set total(v: number) {
        if (v === this._total) {
            return;
        }

        this._total = v;
    }

    _total = 1;

    /**
     * 所在頁
     * @returns currentPage
     */
    @Input()
    get nowPage() { return this._nowPage; }

    /**
     * Sets page
     */
    set nowPage(value: number) {
        if (!value || value === this._nowPage) {
            return;
        }

        this._nowPage = value;
        this.cd.markForCheck();
    }

    /**
     * constructor
     * @param cd ChangeDetectorRef
     */
    constructor(private cd: ChangeDetectorRef) { }

    // 總頁數
    page: number[] = [];
    // 當前頁數
    _nowPage = 1;

    /**
     * 取得呈現的分頁
     * @returns pagesAry
     */
    get renderPages(): number[] {
        const currentPage = this.nowPage;

        let min = currentPage - 2;
        let max = currentPage + 2;

        if (min <= 0) {
            min = 1;
            max = 5;
        }

        if (max > this._total) {
            min = this._total - 4;
            max = this._total;
        }

        min = min < 1 ? 1 : min;
        const pagesAry = [];

        for (let i = min; i <= max; i += 1) {
            pagesAry.push(i);
        }

        return pagesAry;
    }

    /**
     * 改變分頁
     * @param page 當前頁
     */
    changePage(page: number) {
        this._nowPage = page;
        if (typeof (page) === "string") {
            this._nowPage = parseInt(page, 10);
        }

        this.changePageEmitter.emit(this._nowPage);
    }
}
