import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { lastValueFrom, of } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";
import { IssueTicketComponent } from "./issue-ticket.component";

const credits = {
    id: 912649,
    cast: [
        {
            adult: false,
            gender: 2,
            id: 1763709,
            known_for_department: "Acting",
            name: "亞倫·皮埃爾",
            original_name: "Aaron Pierre",
            popularity: 49.103,
            profile_path: "/hNwZWdT2KxKj1YLbipvtUhNjfAp.jpg",
            cast_id: 12,
            character: "Mufasa (voice)",
            credit_id: "61290e9ee8a3e100623cdc79",
            order: 0
        },
        {
            adult: false,
            gender: 2,
            id: 1344361,
            known_for_department: "Acting",
            name: "小凱文·哈里森",
            original_name: "Kelvin Harrison Jr.",
            popularity: 16.389,
            profile_path: "/mMjLXFUOe5KatK0Wipwb6PRmiUv.jpg",
            cast_id: 13,
            character: "Taka (voice)",
            credit_id: "61290ee48d1b8e00274ef40e",
            order: 1
        },
        {
            adult: false,
            gender: 1,
            id: 1074676,
            known_for_department: "Acting",
            name: "Tiffany Boone",
            original_name: "Tiffany Boone",
            popularity: 7.91,
            profile_path: "/9LwqRFdSzxVtnutDUg98YLq0bSz.jpg",
            cast_id: 33,
            character: "Sarabi (voice)",
            credit_id: "662fc6c9072166012a6a405f",
            order: 2
        },
        {
            adult: false,
            gender: 2,
            id: 107529,
            known_for_department: "Acting",
            name: "Kagiso Lediga",
            original_name: "Kagiso Lediga",
            popularity: 11.3,
            profile_path: "/nfqx3CqFVsAMelk6ry560SuN7Y0.jpg",
            cast_id: 34,
            character: "Young Rafiki (voice)",
            credit_id: "662fc70151c01f012a59e903",
            order: 3
        },
        {
            adult: false,
            gender: 2,
            id: 1251835,
            known_for_department: "Acting",
            name: "Preston Nyman",
            original_name: "Preston Nyman",
            popularity: 13.486,
            profile_path: "/eidKvLDCRw68tG3CN6fGhvHUnW.jpg",
            cast_id: 35,
            character: "Zazu (voice)",
            credit_id: "662fc717c3aa3f0129fdf9e4",
            order: 4
        }
    ],
    crew: [
        {
            adult: false,
            gender: 2,
            id: 92784,
            known_for_department: "Directing",
            name: "Barry Jenkins",
            original_name: "Barry Jenkins",
            popularity: 9.317,
            profile_path: "/6nld5eQwiJmuLmyesk4EUeCaoo3.jpg",
            credit_id: "5fa9c38b1b7294003b96e62b",
            department: "Directing",
            job: "Director"
        }
    ]
};

const rate = {
    id: 912649,
    results: [
        {
            iso_3166_1: "US",
            release_dates: [
                {
                    certification: "PG",
                    descriptors: [],
                    iso_639_1: "",
                    note: "Los Angeles, California",
                    release_date: "2024-12-09T00:00:00.000Z",
                    type: 1
                },
                {
                    certification: "PG",
                    descriptors: [],
                    iso_639_1: "",
                    note: "",
                    release_date: "2024-12-20T00:00:00.000Z",
                    type: 3
                }
            ]
        }
    ]
};

const detailMock = {
    adult: false,
    backdrop_path: "/oHPoF0Gzu8xwK4CtdXDaWdcuZxZ.jpg",
    belongs_to_collection: {
        id: 762512,
        name: "The Lion King (Reboot) Collection",
        poster_path: "/dGpIRn4Nqi63JO1RlKxjcPbQSAw.jpg",
        backdrop_path: "/jIgM7YNVft0YGeXsqrh3oG5TWLx.jpg"
    },
    budget: 200000000,
    genres: [
        {
            id: 12,
            name: "冒险"
        },
        {
            id: 10751,
            name: "家庭"
        },
        {
            id: 18,
            name: "剧情"
        },
        {
            id: 16,
            name: "动画"
        }
    ],
    homepage: "",
    id: 762509,
    imdb_id: "tt13186482",
    origin_country: [
        "US"
    ],
    original_language: "en",
    original_title: "Mufasa: The Lion King",
    overview: "故事開始由拉飛奇為辛巴與娜娜的小獅子女兒琪拉雅敘述榮耀國傳奇木法沙的故事，更由澎澎與丁滿在旁為故事加入幽默又搞笑的見解。故事以回述方式呈現…木法沙曾是一個孤兒幼獅，徬徨漂泊異地，直到他遇見了溫暖的皇室繼承人塔卡，這場相遇開啟了一場不凡的旅程，一路上更碰到了一群看似格格不入的旅伴，友情卻將它們緊緊相連。它們相互扶持抗致命的威脅，命運也考驗著他們的連結…",
    popularity: 3139.872,
    poster_path: "/14XzKeHrKCjTIDUoct26Sbsh5T5.jpg",
    production_companies: [
        {
            id: 2,
            logo_path: "/wdrCwmRnLFJhEoH8GSfymY85KHT.png",
            name: "Walt Disney Pictures",
            origin_country: "US"
        }
    ],
    production_countries: [
        {
            iso_3166_1: "US",
            name: "United States of America"
        }
    ],
    release_date: "2024-12-18",
    revenue: 125644218,
    runtime: 118,
    spoken_languages: [
        {
            english_name: "English",
            iso_639_1: "en",
            name: "English"
        }
    ],
    status: "Released",
    tagline: "從孤兒 到異響 終成王",
    title: "獅子王：木法沙",
    video: false,
    vote_average: 7,
    vote_count: 193
};

const reDetailMock = {
    adult: false,
    backdrop_path: "/oHPoF0Gzu8xwK4CtdXDaWdcuZxZ.jpg",
    belongs_to_collection: {
        id: 762512,
        name: "The Lion King (Reboot) Collection",
        poster_path: "/dGpIRn4Nqi63JO1RlKxjcPbQSAw.jpg",
        backdrop_path: "/jIgM7YNVft0YGeXsqrh3oG5TWLx.jpg"
    },
    budget: 200000000,
    genres: "冒险、家庭、剧情、动画",
    homepage: "",
    id: 762509,
    imdb_id: "tt13186482",
    origin_country: [
        "US"
    ],
    original_language: "en",
    original_title: "Mufasa: The Lion King",
    overview: "故事開始由拉飛奇為辛巴與娜娜的小獅子女兒琪拉雅敘述榮耀國傳奇木法沙的故事，更由澎澎與丁滿在旁為故事加入幽默又搞笑的見解。故事以回述方式呈現…木法沙曾是一個孤兒幼獅，徬徨漂泊異地，直到他遇見了溫暖的皇室繼承人塔卡，這場相遇開啟了一場不凡的旅程，一路上更碰到了一群看似格格不入的旅伴，友情卻將它們緊緊相連。它們相互扶持抗致命的威脅，命運也考驗著他們的連結…",
    popularity: 3139.872,
    poster_path: "/14XzKeHrKCjTIDUoct26Sbsh5T5.jpg",
    production_companies: [
        {
            id: 2,
            logo_path: "/wdrCwmRnLFJhEoH8GSfymY85KHT.png",
            name: "Walt Disney Pictures",
            origin_country: "US"
        }
    ],
    production_countries: [
        {
            iso_3166_1: "US",
            name: "United States of America"
        }
    ],
    release_date: "2024-12-18",
    revenue: 125644218,
    runtime: 118,
    spoken_languages: [
        {
            english_name: "English",
            iso_639_1: "en",
            name: "English"
        }
    ],
    status: "Released",
    tagline: "從孤兒 到異響 終成王",
    title: "獅子王：木法沙",
    video: false,
    vote_average: 7,
    vote_count: 193,
    director: {
        adult: false,
        gender: 2,
        id: 92784,
        known_for_department: "Directing",
        name: "Barry Jenkins",
        original_name: "Barry Jenkins",
        popularity: 9.317,
        profile_path: "/6nld5eQwiJmuLmyesk4EUeCaoo3.jpg",
        credit_id: "5fa9c38b1b7294003b96e62b",
        department: "Directing",
        job: "Director"
    },
    cast: "亞倫·皮埃爾、小凱文·哈里森、Tiffany Boone、Kagiso Lediga、Preston Nyman",
    rate: "PG",
    rateImg: "rating"
};

describe("IssueTicketComponent", () => {
    let component: IssueTicketComponent;
    let fixture: ComponentFixture<IssueTicketComponent>;

    const spyMock = jasmine.createSpyObj(["TmdbRepositoryService", "getMovieDetail", "getMovieDetailCredits", "getMovieDetailRate"]);
    spyMock.getMovieDetail.and.returnValue(of(detailMock));
    spyMock.getMovieDetailCredits.and.returnValue(of(credits));
    spyMock.getMovieDetailRate.and.returnValue(of(rate));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IssueTicketComponent],
            providers: [
                provideRouter([]),
                { provide: TmdbRepositoryService, useValue: spyMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IssueTicketComponent);
        component = fixture.componentInstance;

        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.el = {
            nativeElement: {
                initialize: jasmine.createSpy("initialize")
            } as any
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("測試nginit取得電影詳細資料", async () => {
        await component.getMovieDetail();
        expect(component.movieDetail).toEqual(reDetailMock);
    });

    it("測試取得電影詳細資料", async () => {
        const tmdbRepositoryService = TestBed.inject(TmdbRepositoryService);
        const res = await lastValueFrom(tmdbRepositoryService.getMovieDetail("11245", { language: "zh-TW" }));
        expect(res).toEqual(detailMock);
    });

    it("swiper是否被呼叫", () => {
        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.ngAfterViewInit();
        expect(swiperElement.el.nativeElement.initialize).toHaveBeenCalled();
    });

    it("連結事件是否被註銷", () => {
        const clickableEl = fixture.debugElement.query(By.directive(StopPropagationDirective));
        const directiveInstance = clickableEl.injector.get(StopPropagationDirective);
        const onClickSpy = spyOn(directiveInstance, "onClick");

        const event = new Event("click");
        clickableEl.nativeElement.dispatchEvent(event);

        expect(onClickSpy).toHaveBeenCalled();
    });
});
