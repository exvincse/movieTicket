import {
    animate, state, style, transition, trigger
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as OpenCC from "opencc-js";
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb.repository.service";
import { LoginComponent } from "../../../modules/front-platform/login/login.component";
import { StopPropagationDirective } from "../../base/directives/stopPropagation/stop-propagation-directive.directive";
import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";

/**
 * HeaderComponent
 */
@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule, StopPropagationDirective, OverlayscrollbarsModule],
    providers: [],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
    animations: [
        trigger("slideInOut", [
            state("slideIn", style({
                height: "300px",
                overflow: "auto"
            })),
            state("slideOut", style({
                height: "0px",
                overflow: "hidden"
            })),
            transition("slideIn <=> slideOut", [
                animate("300ms ease-in-out")
            ])
        ])
    ]
})
export class HeaderComponent implements OnInit {
    /**
     * constructor
     * @param modalService modalService
     * @param tmdbRepositoryService tmdbRepositoryService
     * @param userRepositoryService UserRepositoryService
     */
    constructor(
        private modalService: NgbModal,
        public tmdbRepositoryService: TmdbRepositoryService,
        public userRepositoryService: UserRepositoryService
    ) { }

    scrollOptions = {
        scrollbars: {
            theme: "os-theme-light"
        }
    };

    faBars = faBars;
    faTimes = faTimes;
    isShowMobileList = false;
    menuList = [false, false, false];
    isVisible = true;
    genresList: any[] = [];

    /**
     * on init
     */
    ngOnInit() {
        this.getAllMovieList();

        this.userRepositoryService.getUserProfile().subscribe((a) => {
            console.log(a);
        });
    }

    /**
     * toggleVisibility
     * @param lv lv
     */
    toggleVisibility(lv: number) {
        this.menuList = this.menuList.map((value, index) => (index === lv ? !value : false));
    }

    /**
     * toggleList
     */
    toggleList() {
        this.isShowMobileList = !this.isShowMobileList;
    }

    /**
     * openLoginDialog
     */
    openLoginDialog() {
        this.defaultMenu();
        this.modalService.open(LoginComponent);
    }

    /**
     * 取得電影類型
     */
    getAllMovieList() {
        this.tmdbRepositoryService.getMovieGenre({ language: "zh-TW" }).subscribe((res) => {
            const converter = OpenCC.Converter({ from: "cn", to: "tw" });

            this.genresList = res.genres.map((item: any) => ({
                ...item,
                name: converter(item.name)
            }));
        });
    }

    /**
     * 選單初始化
     */
    defaultMenu() {
        this.isShowMobileList = false;
        this.menuList = [false, false, false];
    }
}
