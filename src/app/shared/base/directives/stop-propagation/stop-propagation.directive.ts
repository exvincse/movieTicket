import { Directive, HostListener } from "@angular/core";

/**
 * StopPropagationDirective
 */
@Directive({
    selector: "[appStopPropagation]",
    standalone: true
})
export class StopPropagationDirective {
    /**
     * HostListener
     * @param event click event
     */
    @HostListener("click", ["$event"])
    onClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }
}
