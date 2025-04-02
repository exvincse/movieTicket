import { CommonModule } from "@angular/common";
import {
    Component, CUSTOM_ELEMENTS_SCHEMA, OnInit
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MovieDetailEntity } from "@app/core/models/entities/movie/movie-detail-entity";
import { TicketDateTimeEntity } from "@app/core/models/entities/ticket/ticket-date-time-entity";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import * as OpenCC from "opencc-js";
import { lastValueFrom } from "rxjs";
import { SwiperOptions } from "swiper/types";

import { TicketRepositoryService } from "../../../core/api/middleware/ticket/ticket-repository.service";
import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { TicketCategoryEntity } from "../../../core/models/entities/ticket/ticket-category-entity";
import { TicketLanguageEntity } from "../../../core/models/entities/ticket/ticket-language-entity";
import {
    Seat, TicketParam, TicketSelect
} from "../../../core/models/entities/ticket/ticket-select.entity";
import { TextAlertComponent } from "../../../shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "../../../shared/base/component/sweet-alert/service/sweet-alert.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stop-propagation/stop-propagation.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper/swiper.directive";
import { UserStoreService } from "../../../store/user/service/user-store.service";
import { SeatChartComponent } from "../seat-chart/seat-chart.component";

/**
 * IssueTicketComponent
 */
@Component({
    selector: "app-issue-ticket",
    standalone: true,
    imports: [CommonModule, FormsModule, SwiperDirective, FontAwesomeModule, SeatChartComponent, StopPropagationDirective],
    templateUrl: "./issue-ticket.component.html",
    styleUrl: "./issue-ticket.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IssueTicketComponent implements OnInit {
    /**
     * constructor
     * @param route ActivatedRoute
     * @param tmdbRepositoryService tmdbRepositoryService
     * @param ticketRepositoryService ticketRepositoryService
     * @param sweetAlertService SweetAlertService
     * @param userStoreService UserStoreService
     */
    constructor(
        public route: ActivatedRoute,
        public tmdbRepositoryService: TmdbRepositoryService,
        public ticketRepositoryService: TicketRepositoryService,
        public sweetAlertService: SweetAlertService,
        public userStoreService: UserStoreService,
    ) { }

    movieDetail: MovieDetailEntity = {
        id: 0,
        title: "",
        genres: "",
        director: "",
        cast: "",
        rate: "",
        rateImg: "",
        adult: false,
        backdrop_path: "",
        belongs_to_collection: "",
        budget: 0,
        homepage: "",
        imdb_id: "",
        original_language: "",
        original_title: "",
        overview: "",
        popularity: 0,
        poster_path: "",
        production_companies: [],
        production_countries: [],
        release_date: "",
        revenue: 0,
        runtime: 0,
        spoken_languages: [],
        status: "",
        tagline: "",
        video: false,
        vote_average: 0,
        vote_count: 0,
        origin_country: []
    };

    faGreaterThan = faGreaterThan;

    date: string[] = [];

    ticketCount = new Array(11).fill(0).map((_, i) => i);

    ticketSelect: TicketSelect = {
        date: moment().format("YYYY-MM-DD"),
        ticketLanguageCode: "",
        ticketLanguageName: "",
        time: "",
        ticketCategory: []
    };

    ticketCategory: TicketCategoryEntity[] = [];

    ticketLanguage: TicketLanguageEntity[] = [];

    ticketTime: TicketDateTimeEntity[] = [
        {
            code: "001",
            name: "13:10",
            isDisable: false
        },
        {
            code: "002",
            name: "16:10",
            isDisable: false
        },
        {
            code: "003",
            name: "20:10",
            isDisable: false
        },
        {
            code: "003",
            name: "22:10",
            isDisable: false
        }
    ];

    isHiddenSelectSeat = true;

    disableSeatSeat: Seat[] = [];

    swiperConfig: SwiperOptions = {
        slidesPerView: "auto",
        spaceBetween: 10,
        pagination: false,
        navigation: {
            nextEl: ".c-dateTab__next",
            prevEl: ".c-dateTab__prev"
        }
    };

    /**
     * on init
     */
    ngOnInit() {
        this.getMovieDetail();
        this.getTickCategory();
        this.getTickLanguage();
        this.getTickTime();

        this.ticketTime.forEach((item) => {
            const nowTime = moment();
            const tickTime = moment(`${this.ticketSelect.date} ${item.name}`, "YYYY-MM-DD HH:mm").subtract(1, "hours");
            Object.assign(item, { isDisable: nowTime.isAfter(tickTime) });
        });
    }

    /**
     * 取得電影合併資料
     */
    async getMovieDetail() {
        const converter = OpenCC.Converter({ from: "cn", to: "tw" });

        const movieId = this.route.snapshot.params["id"];

        const params = {
            language: "zh-TW",
        };

        const { list, credits, rate } = await lastValueFrom(this.tmdbRepositoryService.getMovieMergeDetail(movieId, params));

        const movieDetailRate = rate.results.find((item) => item.iso_3166_1 === "US");

        const director = credits.crew.find((item) => item.job === "Director")?.name || "";

        const cast = credits.cast.filter((item) => item.order < 5).map((item) => item.name).join("、") || "";

        this.movieDetail = {
            ...list,
            genres: converter(list.genres.map((item) => item.name).join("、")),
            director,
            cast,
            rate: movieDetailRate ? movieDetailRate.release_dates[0].certification : "",
            rateImg: ""
        };

        switch (this.movieDetail.rate) {
            case "R":
                this.movieDetail.rateImg = "rating_18";
                break;
            case "PG-13":
                this.movieDetail.rateImg = "rating_12";
                break;
            case "15":
                this.movieDetail.rateImg = "rating_15";
                break;
            default:
                this.movieDetail.rateImg = "rating";
                break;
        }
    }

    /**
     * 取得電影票卷分類
     */
    getTickCategory() {
        this.ticketRepositoryService.getTicketCategory().subscribe((res) => {
            this.ticketCategory = res.result;
            this.ticketSelect.ticketCategory = res.result.map((item) => ({
                ...item,
                count: 0
            }));
        });
    }

    /**
     * 取得電影票卷語言
     */
    getTickLanguage() {
        this.ticketRepositoryService.getTicketLanguage().subscribe((res) => {
            this.ticketLanguage = res.result;
        });
    }

    /**
     * 取得電影票卷上映時間
     */
    getTickTime() {
        for (let i = 0; i < 5; i += 1) {
            this.date.push(moment().add(i, "d").format("YYYY-MM-DD"));
        }
    }

    /**
     * 選擇日期
     * @param date date
     */
    selectTicketDate(date: string) {
        this.ticketSelect.date = date;
        this.ticketSelect.ticketLanguageCode = "";
        this.ticketSelect.ticketLanguageName = "";
        this.ticketSelect.time = "";
        this.isHiddenSelectSeat = true;

        this.ticketTime.forEach((item) => {
            const nowTime = moment();
            const tickTime = moment(`${this.ticketSelect.date} ${item.name}`, "YYYY-MM-DD HH:mm").subtract(1, "hours");
            Object.assign(item, { isDisable: nowTime.isAfter(tickTime) });
        });
    }

    /**
     * 選擇時間
     * @param item TicketCategory
     * @param time time
     */
    selectTicketTime(item: TicketLanguageEntity, time: string) {
        this.ticketSelect.ticketLanguageCode = item.categoryCode;
        this.ticketSelect.ticketLanguageName = item.categoryName;
        this.ticketSelect.time = time;
        this.ticketSelect.ticketCategory = this.ticketSelect.ticketCategory.map((x) => ({
            ...x,
            count: 0
        }));
    }

    /**
     * 取得總票數
     * @returns tickCategoryCount
     */
    get tickCategoryCount() {
        return this.ticketSelect.ticketCategory.map((x) => x.count).reduce((a, b) => a + b, 0);
    }

    /**
     * 選擇票種
     * @param event Event
     * @param index index
     */
    selectTickCategory(event: any, index: number) {
        this.ticketSelect.ticketCategory[index].count = parseInt(event, 10);
    }

    /**
     * 送出票卷
     * @param seat 座位
     */
    submitTicket(seat: Seat[]) {
        this.userStoreService.getUserData().subscribe((user) => {
            if (user !== null && user.userNo !== 0) {
                const ticketCategory: TicketParam[] = [];

                let count = 0;
                // 把票卷語言分類、票種、座位資料合併
                this.ticketSelect.ticketCategory.filter((x) => x.count > 0).forEach((y) => {
                    for (let i = 0; i < y.count; i += 1) {
                        ticketCategory.push({
                            ...y,
                            column: seat[count].column,
                            seat: seat[count].seat ?? 0,
                        });

                        count += 1;
                    }
                });

                // 總金額
                const { cost } = ticketCategory.reduce((acc, cur) => ({ cost: acc.cost + cur.cost }), { cost: 0 });

                const param = {
                    movieId: this.movieDetail.id,
                    movieName: this.movieDetail.title,
                    ticketDateTime: moment(`${this.ticketSelect.date} ${this.ticketSelect.time}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm:ss"),
                    ticketLanguageCode: this.ticketSelect.ticketLanguageCode,
                    ticketLanguageName: this.ticketSelect.ticketLanguageName,
                    ticketCategory,
                    totalCost: cost
                };

                this.ticketRepositoryService.postSealTicket(param).subscribe((res) => {
                    if (res.result !== false) {
                        // 後端回傳paypal付款連結
                        window.location.href = res.result as string;
                    } else {
                        this.sweetAlertService.open(TextAlertComponent, {
                            icon: "error",
                            data: {
                                text: res.message
                            }
                        });
                    }
                });
            } else {
                this.sweetAlertService.open(TextAlertComponent, {
                    icon: "error",
                    data: {
                        text: "請先登入"
                    }
                });
            }
        });
    }

    /**
     * 選取座位
     */
    selectSeat() {
        const param = {
            movieId: this.movieDetail.id,
            movieTicketDateTime: moment(`${this.ticketSelect.date} ${this.ticketSelect.time}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm:ss"),
            ticketLanguageCode: this.ticketSelect.ticketLanguageCode
        };

        // 取得座位狀態
        this.ticketRepositoryService.postSelectSeat(param).subscribe((res) => {
            this.disableSeatSeat = res.result;
            this.isHiddenSelectSeat = false;
        });
    }
}
