import { CommonModule } from "@angular/common";
import {
    AfterViewInit, Component,
    Inject
} from "@angular/core";
import { Observable, Subject } from "rxjs";

import { OPTION } from "./service/glightbox.service";

declare let GLightbox: any;

/**
 * Component
 */
@Component({
    selector: "app-glightbox",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./glightbox.component.html",
    styleUrls: ["./glightbox.component.scss"]
})
export class GlightboxComponent implements AfterViewInit {
    private lightbox: any;

    private afterClose = new Subject();

    afterClose$: Observable<any> = this.afterClose.asObservable();

    /**
     * constructor
     * @param option option
     */
    constructor(@Inject(OPTION) public option: any) { }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
        this.lightbox = GLightbox({
            selector: "glightbox"
        });

        this.lightbox.setElements([{ href: this.option.url, src: this.option.url }]);
        this.lightbox.open();

        this.lightbox.on("close", () => {
            this.afterClose.next(this.option.url);
        });
    }
}
