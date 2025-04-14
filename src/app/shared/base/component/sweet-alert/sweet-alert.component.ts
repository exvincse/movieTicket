import { CommonModule } from "@angular/common";
import {
    AfterViewInit, Component,
    ComponentRef,
    Injector,
    OnDestroy,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { SwalComponent, SwalPortalTargets, SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { Subject } from "rxjs";

import { SweetAlertConfig } from "./sweet-alert-config";

/**
 * SweetAlert Component
 */
@Component({
    selector: "app-sweet-alert",
    standalone: true,
    imports: [CommonModule, SweetAlert2Module],
    templateUrl: "./sweet-alert.component.html",
    styleUrls: ["./sweet-alert.component.scss"]
})
export class SweetAlertComponent implements AfterViewInit, OnDestroy {
    @ViewChild("swalComponent") swalComponent!: SwalComponent;
    @ViewChild("templateRef", { read: ViewContainerRef }) templateRef!: ViewContainerRef;

    afterClose = new Subject<boolean>();

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

        // if (!this.afterClose.closed) {
        //     this.afterClose.complete();
        // }
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
        this.templateRef.clear();

        this.componentRef = this.templateRef.createComponent(component, {
            injector: this.slotInjector
        });
    }

    /**
     * 動態載入template
     * @param template TemplateRef
     */
    loadSlotTemplate(template: TemplateRef<any>) {
        this.templateRef.clear();
        this.templateRef.createEmbeddedView(template, this.option.data);
    }
}
