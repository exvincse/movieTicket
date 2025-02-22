import { CommonModule } from "@angular/common";
import {
    AfterViewInit, Component,
    ComponentRef,
    Injector,
    OnDestroy,
    TemplateRef,
    Type,
    ViewChild
} from "@angular/core";
import { SwalComponent, SwalPortalTargets, SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { Subject } from "rxjs";

import { InsertionDirective } from "../../directives/insertion.directive";
import { SweetAlertConfig } from "./sweet-alert-config";

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

    // 掛載component或template
    slotTemplate!: Type<any> | TemplateRef<any>;

    componentRef!: ComponentRef<any>;

    // 注入掛載component或template設定值
    slotInjector!: Injector;

    /**
     * constructor
     * @param swalTargets SwalPortalTargets
     * @param option SweetAlertConfig
     */
    constructor(
        public swalTargets: SwalPortalTargets,
        public option: SweetAlertConfig
    ) { }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
        this.swalComponent.fire();
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    /**
     * 套件開啟事件
     */
    swalDidOpen() {
        // 套件開啟會有時間差，延遲後掛載元件
        setTimeout(() => {
            if (this.slotTemplate instanceof TemplateRef) {
                this.loadSlotTemplate(this.slotTemplate);
            } else {
                this.loadSlotComponent(this.slotTemplate);
            }
        });
    }

    /**
     * 套件關閉事件
     */
    swalDidClose() {
        this.afterClose.next(true);
    }

    /**
     * 動態載入component,
     * @param component Component
     */
    loadSlotComponent(component: Type<any>) {
        const { viewContainerRef } = this.insertionPoint;
        viewContainerRef.clear();

        this.componentRef = viewContainerRef.createComponent(component, {
            injector: this.slotInjector
        });
    }

    /**
     * 動態載入template
     * @param template TemplateRef
     */
    loadSlotTemplate(template: TemplateRef<any>) {
        const { viewContainerRef } = this.insertionPoint;
        viewContainerRef.clear();
        viewContainerRef.createEmbeddedView(template, this.option.data);
    }
}
