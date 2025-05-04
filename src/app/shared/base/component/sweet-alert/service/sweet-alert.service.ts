import {
    ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable,
    Injector,
    Type
} from "@angular/core";

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

    /**
     * constructor
     * @param appRef appRef
     * @param injector injector
     * @param environmentInjector environmentInjector
     */
    constructor(
        private appRef: ApplicationRef,
        private injector: Injector,
        private environmentInjector: EnvironmentInjector
    ) { }

    /**
     * open
     * @param component component
     * @param option option
     * @returns componentRef
     */
    open(component: any, option?: SweetAlertConfig) {
        return this.create(component, {
            ...new SweetAlertConfig(),
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
    create<T>(component: Type<T>, option?: SweetAlertConfig): ComponentRef<SweetAlertComponent> {
        if (!this.componentRef) {
            const hostElement = document.createElement("div");
            document.body.appendChild(hostElement);

            // 建立SweetAlertComponent基底元件
            this.componentRef = createComponent(SweetAlertComponent, {
                environmentInjector: this.environmentInjector,
                elementInjector: Injector.create({
                    providers: [
                        { provide: SweetAlertConfig, useValue: option }
                    ],
                }),
                hostElement
            });

            // 把自定義元件或viewChild template掛進SweetAlertComponent基底元件
            this.componentRef.instance.slotTemplate = component;
            this.componentRef.instance.slotInjector = Injector.create({
                parent: this.injector,
                providers: [
                    { provide: SweetAlertConfig, useValue: option }
                ],
            });

            // 在SweetAlertComponent訂閱事件
            this.componentRef.instance.afterClose.subscribe(() => {
                this.destory();
            });

            this.appRef.attachView(this.componentRef.hostView);

            return this.componentRef;
        }

        return this.componentRef;
    }

    /**
     * 銷毀元件
     */
    destory() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}
