import { Injectable } from "@angular/core";

import { environmentTMDB } from "../../../../environments/environment";
import { RestfulApiService } from "./restful-api.service";

/**
 * ApiService
 */
@Injectable({
    providedIn: "root"
})
export class TmdbRestfulApiService extends RestfulApiService {
    protected override baseApiUrl = environmentTMDB.apiUrl;
}
