import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { CookieService } from "../../../services/cookie.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * LoginComponent
 */
@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        StopPropagationDirective
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent {
    /**
     * constructor
     * @param fb FormBuilder
     * @param router Router
     * @param userRepositoryService UserRepositoryService
     * @param cookieService CookieService
     */
    constructor(
        public fb: FormBuilder,
        public router: Router,
        public userRepositoryService: UserRepositoryService,
        public cookieService: CookieService
    ) {
        this.loginForm = this.fb.group({
            email: ["", [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
            ]],
            password: ["", [Validators.required, Validators.minLength(8)]],
        });
    }

    loginForm!: FormGroup;

    faEye = faEye;
    faEyeSlash = faEyeSlash;

    isHiddenEye = true;

    /**
     * toggleEye
     */
    toggleEye() {
        this.isHiddenEye = !this.isHiddenEye;
    }

    /**
     * login
     */
    login() {
        if (this.loginForm.valid === true) {
            const value = this.loginForm.getRawValue();
            const param = {
                email: value.email,
                password: value.password
            };

            this.userRepositoryService.postLogin(param).subscribe((res) => {
                if (res.result.accessToken) {
                    this.cookieService.set("accessToken", res.result.accessToken, 5);
                    this.userRepositoryService.getUserProfile();
                    this.router.navigate(["/"]);
                } else {
                    console.log(res);
                }
            });
        }
    }
}
