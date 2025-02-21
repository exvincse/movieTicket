import {
    ApplicationRef, ComponentRef, createComponent, Injectable,
    InjectionToken,
    Injector,
    Type
} from "@angular/core";
import {
    Observable, Subject
} from "rxjs";
import { SweetAlertOptions } from "sweetalert2";

import { SweetAlertComponent } from "../sweet-alert.component";
import { SweetAlertConfig } from "../sweet-alert-config";

export const OPTION = new InjectionToken<SweetAlertOptions>("OPTION");

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
     */
    constructor(private appRef: ApplicationRef) { }

    /**
     * open
     * @param component component
     * @param option option
     * @returns componentRef
     */
    open(component: any, option?: SweetAlertOptions) {
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
            this.componentRef = createComponent(SweetAlertComponent, {
                environmentInjector: this.appRef.injector,
                elementInjector: Injector.create({
                    providers: [
                        { provide: OPTION, useValue: option }
                    ],
                }),
            });

            this.componentRef.instance.childTemplate = component;
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
