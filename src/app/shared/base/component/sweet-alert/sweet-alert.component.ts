import { CommonModule } from "@angular/common";
import {
    AfterViewInit, Component,
    ComponentRef,
    EnvironmentInjector,
    Inject,
    OnDestroy,
    TemplateRef,
    Type,
    ViewChild
} from "@angular/core";
import { SwalComponent, SwalPortalTargets, SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { Subject } from "rxjs";
import { SweetAlertOptions } from "sweetalert2";

import { InsertionDirective } from "../../directives/insertion.directive";
import { OPTION } from "./service/sweet-alert.service";

/**
 * SweetAlert Component
 */
@Component({
    selector: "app-sweet-alert",
    standalone: true,
    imports: [CommonModule, SweetAlert2Module, InsertionDirective],
    templateUrl: "./sweet-alert.component.html",
    styleUrls: ["./sweet-alert.component.scss"]
})
export class SweetAlertComponent implements AfterViewInit, OnDestroy {
    @ViewChild("swalComponent") swalComponent!: SwalComponent;
    @ViewChild(InsertionDirective, { static: false }) insertionPoint!: InsertionDirective;

    afterClose = new Subject();

    childTemplate!: Type<any> | TemplateRef<any>;

    componentRef!: ComponentRef<any>;

    childInjector!: EnvironmentInjector;

    /**
     * constructor
     * @param swalTargets SwalPortalTargets
     * @param option option
     */
    constructor(
        public swalTargets: SwalPortalTargets,
        @Inject(OPTION) public option: SweetAlertOptions
    ) { }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
        this.swalComponent.fire();
    }

    /**
     * on destroy
     */
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    /**
     * swalDidOpen
     */
    swalDidOpen() {
        setTimeout(() => {
            if (this.childTemplate instanceof TemplateRef) {
                this.loadChildTemplate(this.childTemplate);
            }
        });
    }

    /**
     * swalDidClose
     */
    swalDidClose() {
        this.afterClose.next(true);
    }

    /**
     * 動態載入component,
     * @param component Component
     */
    loadChildComponent(component: Type<any>) {
        const { viewContainerRef } = this.insertionPoint;
        viewContainerRef.clear();

        this.componentRef = viewContainerRef.createComponent(component, {
            environmentInjector: this.childInjector,
        });
    }

    /**
     * 動態載入template
     * @param template TemplateRef
     * @param context context
     */
    loadChildTemplate(template: TemplateRef<any>, context?: any) {
        const { viewContainerRef } = this.insertionPoint;
        viewContainerRef.clear();
        viewContainerRef.createEmbeddedView(template, context);
    }
}
