import { Directive, ViewContainerRef } from "@angular/core";

/**
 * Directive
 */
@Directive({
    selector: "[appInsertion]",
    exportAs: "insertion",
    standalone: true
})
export class InsertionDirective {
    /**
     * Creates an instance of host directive.
     * @param viewContainerRef viewContainerRef
     */
    constructor(public viewContainerRef: ViewContainerRef) { }
}
