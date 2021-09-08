import { tv, Page, VPage, LMR, List } from "tonva-react";
import { CHome } from ".";

export class VPickupPage extends VPage<CHome> {

    init(param: any) {
    }

    header() { return '待拣货任务' }


    content() {

        return <div id="pickListDiv" className="p-1 bg-white">

        </div>;
    }
}