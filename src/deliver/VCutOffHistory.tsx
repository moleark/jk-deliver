import { VPage, LMR, List, Scroller } from "tonva-react";
import { CDeliver } from "./CDeliver";

export class VCutOffHistory extends VPage<CDeliver> {

    private cutOffHistoryList: any;
    private warehouse: number;
    init(param: any) {
        let { warehouse, historyList } = param;
        this.warehouse = warehouse;
        this.cutOffHistoryList = historyList;
    }

    header() { return '截单历史' }

    private renderCutOffHistory = (cutOffHistory: any) => {

        let { id, no, cutter } = cutOffHistory;
        let { onOpenCutOffDetail } = this.controller;
        // let right = <div className="text-muted">{cutter}</div>

        return <LMR className="px-1 py-1" right={undefined} onClick={() => onOpenCutOffDetail(id)}>
            <div className="row col-12 py-1"> {no} </div>
        </LMR>;
    }

    onPageScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        this.cutOffHistoryList.more();
    }

    content() {
        return <div id="pickListDiv" className="p-1 bg-white">
            <List items={this.cutOffHistoryList} item={{ render: this.renderCutOffHistory }} none="无截单历史" />
        </div>;
    }
}