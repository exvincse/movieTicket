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

import { TmdbRepositoryService } from "../../../core/api/tmdb/tmdb.repository.service";
import { LoginComponent } from "../../../modules/front-platform/login/login.component";
import { StopPropagationDirective } from "../../base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * HeaderComponent
 */
@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, StopPropagationDirective, RouterModule],
    providers: [],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
    animations: [
        trigger("slideInOut", [
            state("slideIn", style({
                "max-height": "300px",
                "overflow-y": "scroll"
            })),
            state("slideOut", style({
                "max-height": "0px",
                "overflow-y": "hidden"
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
     */
    constructor(
        private modalService: NgbModal,
        public tmdbRepositoryService: TmdbRepositoryService
    ) { }

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
