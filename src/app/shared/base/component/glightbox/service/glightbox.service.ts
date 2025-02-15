import {
    ApplicationRef, createComponent, Injectable,
    InjectionToken,
    Injector,
    Type
} from "@angular/core";
import {
    Observable, Subject
} from "rxjs";

export const OPTION = new InjectionToken<any>("OPTION");

/**
 * GlightboxService
 */
@Injectable({
    providedIn: "root"
})
export class GlightboxService {
    private componentRef: any;

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
    open(component: any, option: any) {
        return this.create(component, option);
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
    create<T>(component: Type<T>, option?: any): any {
        if (!this.componentRef) {
            this.componentRef = createComponent(component, {
                environmentInjector: this.appRef.injector,
                elementInjector: Injector.create({
                    providers: [
                        { provide: OPTION, useValue: option }
                    ],
                }),
            });

            this.componentRef.instance.afterClose.subscribe((res: any) => {
                this.destory();
                this.afterClose$.next(res);
                if (!this.afterClose$.closed) {
                    this.afterClose$.complete();
                }
            });

            this.appRef.attachView(this.componentRef.hostView);

            const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
            domElem.className = "glightbox";
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
