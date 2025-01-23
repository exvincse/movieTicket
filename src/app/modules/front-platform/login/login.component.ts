import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import cookies from "js-cookie";

import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * LoginComponent
 */
@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule, StopPropagationDirective],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent {
    /**
     * constructor
     * @param activeModal NgbActiveModal
     * @param userRepositoryService UserRepositoryService
     */
    constructor(public activeModal: NgbActiveModal, public userRepositoryService: UserRepositoryService) { }

    email = "admin@gmail.com";
    password = "123456";

    /**
     * close
     */
    login() {
        const param = {
            email: this.email,
            password: this.password
        };

        this.userRepositoryService.postLogin(param).subscribe((res) => {
            if (res.result.isAccountError === true) {
                console.log(res);
            } else {
                cookies.set("accessToken", res.result.accessToken, { expires: 7 });
                this.activeModal.close();
            }
        });

        // setTimeout(() => {
        //     this.apiService.get("User/RefreshToken").subscribe((a) => {
        //         console.log(a);
        //     });
        // }, 2000);
    }

    /**
     * close
     */
    close() {
        this.activeModal.close();
    }
}
