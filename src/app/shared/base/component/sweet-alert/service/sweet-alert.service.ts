import {
    ApplicationRef, ComponentRef, createComponent, Injectable,
    Injector,
    Type
} from "@angular/core";
import {
    Observable, Subject
} from "rxjs";

import { SweetAlertComponent } from "../sweet-alert.component";
import { SweetAlertConfig } from "../sweet-alert-config";

/**
 * SweetAlertService
 */
@Injectable({
    providedIn: "root"
})
export class SweetAlertService {
    private componentRef: ComponentRef<SweetAlertComponent> | null = null;

    private readonly afterClose$ = new Subject<any>();
    readonly afterClose: Observable<any> = this.afterClose$.asObservable();

    /**
     * constructor
     * @param appRef appRef
     * @param injector injector
     */
    constructor(
        private appRef: ApplicationRef,
        private injector: Injector,
    ) { }

    /**
     * open
     * @param component component
     * @param option option
     * @returns componentRef
     */
    open(component: any, option?: any) {
        return this.create(component, {
            ...SweetAlertConfig,
            ...option
        });
    }

    /**
     * close
     */
    close() {
        this.destory();
    }

    /**
     * 加載元件到全域範圍
     * @param component component
     * @param option option
     * @returns componentRef
     */
    create<T>(component: Type<T>, option?: any): ComponentRef<SweetAlertComponent> {
        if (!this.componentRef) {
            // 建立SweetAlertComponent基底元件
            this.componentRef = createComponent(SweetAlertComponent, {
                environmentInjector: this.appRef.injector,
                elementInjector: Injector.create({
                    providers: [
                        { provide: SweetAlertConfig, useValue: option }
                    ],
                }),
            });

            // 把自定義元件或viewChild template掛進SweetAlertComponent基底元件
            this.componentRef.instance.slotTemplate = component;
            this.componentRef.instance.slotInjector = Injector.create({
                parent: this.injector,
                providers: [
                    { provide: SweetAlertConfig, useValue: option }
                ],
            });

            // 在SweetAlertComponent訂閱事件，關閉SweetAlertComponent觸發next事件，確保關閉時訂閱都已解除
            this.componentRef.instance.afterClose.subscribe((res: any) => {
                this.destory();
                this.afterClose$.next(res);
                if (!this.afterClose$.closed) {
                    this.afterClose$.complete();
                }
            });

            this.appRef.attachView(this.componentRef.hostView);

            const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);
            return this.componentRef;
        }

        return this.componentRef;
    }

    /**
     * 銷毀元件
     */
    destory() {
        if (this.componentRef) {
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}
