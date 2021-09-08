import { tv, Page, VPage, LMR, List } from "tonva-react";
import { CHome } from ".";

export class VCutOffPage extends VPage<CHome> {

    init(param: any) {
    }

    header() { return '库房待截单任务' }


    content() {

        return <div id="pickListDiv" className="p-1 bg-white">

        </div>;
    }
}