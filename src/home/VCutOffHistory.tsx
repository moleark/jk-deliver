import { tv, Page, VPage, LMR, List } from "tonva-react";
import { CHome } from "../home";

export class VCutOffHistory extends VPage<CHome> {

    private cutOffHistoryList: any[];
    private warehouse: number;
    init(param: any) {
        let { warehouse, historyList } = param;
        this.warehouse = warehouse;
        this.cutOffHistoryList = historyList;
    }

    header() { return '截单历史' }

    private renderCutOffHistory = (cutOffHistory: any) => {

        let { id, no } = cutOffHistory;
        let { onOpenCutOffDetail } = this.controller;

        return <LMR className="px-1 py-1" onClick={() => onOpenCutOffDetail(id)}>
            <div className="row col-12 py-1">
                <span className="col-12 pl-1">{no}</span>
            </div>
        </LMR>;
    }

    content() {

        return <div id="pickListDiv" className="p-1 bg-white">
            <List items={this.cutOffHistoryList} item={{ render: this.renderCutOffHistory }} none="无截单历史" />
        </div>;
    }
}