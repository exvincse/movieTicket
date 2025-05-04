import {
    animate, state, style, transition, trigger
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
    Component, OnInit
} from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { MovieGenreOutputModel } from "@app/core/models/outputViewModels/movie/movie-genre-output.model";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faTimes, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import * as OpenCC from "opencc-js";
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import {
    filter, lastValueFrom
} from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { UserStoreService } from "../../../store/user/service/user-store.service";
import { TextAlertComponent } from "../../base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "../../base/component/sweet-alert/service/sweet-alert.service";
import { StopPropagationDirective } from "../../base/directives/stop-propagation/stop-propagation.directive";

/**
 * HeaderComponent
 */
@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule, StopPropagationDirective, OverlayscrollbarsModule],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
    animations: [
        trigger("slideInOut", [
            state("slideIn", style({
                "max-height": "300px",
                overflow: "auto"
            })),
            state("slideOut", style({
                "max-height": "0px",
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
     * @param tmdbRepositoryService tmdbRepositoryService
     * @param userRepositoryService UserRepositoryService
     * @param userStoreService UserStoreService
     * @param router Router
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public tmdbRepositoryService: TmdbRepositoryService,
        public userRepositoryService: UserRepositoryService,
        public userStoreService: UserStoreService,
        public router: Router,
        public sweetAlertService: SweetAlertService
    ) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.isHiddenMenu = ["/register", "/login"].includes(event.url);
                this.isShowMobileList = false;
            });
    }

    scrollOptions = {
        scrollbars: {
            theme: "os-theme-light"
        }
    };

    faBars = faBars;
    faTimes = faTimes;
    faUserCircle = faUserCircle;
    isShowMobileList = false;
    menuList = [false, false];
    genresList: MovieGenreOutputModel[] = [];
    userList = [
        {
            url: "/personal/base",
            name: "個人資料",
            isOpenDialog: false
        },
        {
            url: "",
            name: "登出",
            isOpenDialog: true
        }
    ];
    isHiddenMenu = false;

    /**
     * userData
     * @returns userData
     */
    get userData() {
        return this.userStoreService.getUserData();
    }

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
     * 取得電影類型
     */
    getAllMovieList() {
        this.tmdbRepositoryService.getMovieGenre({ language: "zh-TW" }).subscribe((res) => {
            const converter = OpenCC.Converter({ from: "cn", to: "tw" });

            this.genresList = res.genres.map((item) => ({
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

    /**
     * 登出
     */
    async postLogout() {
        await lastValueFrom(this.userRepositoryService.postLogout());

        const ref = this.sweetAlertService.open(TextAlertComponent, {
            icon: "success",
            data: {
                text: "已登出"
            }
        });

        ref.instance.afterClose.subscribe((res) => {
            if (res === true) {
                this.defaultMenu();
                this.userStoreService.setClearUserData();
                this.router.navigate(["/"]);
            }
        });
    }
}
