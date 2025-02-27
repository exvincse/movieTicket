import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

/**
 * LoaderService
 */
@Injectable({
    providedIn: "root"
})
export class LoaderService {
    private loadingCount = 0;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    /**
     * startLoadingCount
     */
    startLoadingCount() {
        // 動畫次數累積
        this.loadingCount += 1;
        // 通知loading元件，只要大於0就會一直顯示loading動畫
        this.loadingSubject.next(this.loadingCount > 0);
    }

    /**
     * stopLoadingCount
     */
    stopLoadingCount() {
        // 動畫次數累積
        this.loadingCount -= 1;
        // 防只特殊狀況可能會有負數問題
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
        }
        // 通知loading元件，只要大於0就會一直顯示loading動畫
        this.loadingSubject.next(this.loadingCount > 0);
    }
}
