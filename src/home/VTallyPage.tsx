import { tv, Page, VPage, LMR, List } from "tonva-react";
import { CHome } from "../home";

export class VTallyPage extends VPage<CHome> {

    init(param: any) {
    }

    header() { return '库房待截单任务' }

    content() {

        return <div className="p-1 bg-white">
        </div>;
    }
}