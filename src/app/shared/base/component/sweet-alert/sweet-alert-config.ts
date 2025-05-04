import { SweetAlertIcon } from "sweetalert2";

/**
 * 開啟動態元件跟SweetAlert(基底元件)設定
 */
export class SweetAlertConfig {
    icon? = "" as SweetAlertIcon;
    confirmButtonText? = "關閉";
    data?: any;
}
