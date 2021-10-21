import { VPage, LMR, List, Scroller, FA } from "tonva-react";
import { CDeliver } from "./CDeliver";
import { format } from 'date-fns';

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
        let { JkWebuser } = this.controller.uqs;
        let { WebUser } = JkWebuser;
        let { id, no, cutter, create } = cutOffHistory;
        let { onOpenCutOffDetail } = this.controller;
        let right = <FA className="mr-1 cursor-pointer text-info" name="eye" />;

        return <LMR className="px-1 py-1" right={right} onClick={() => onOpenCutOffDetail(id)}>
            <div className="row py-1 col-12">
                <div className="col-5 px-1">{no}</div>
                <div className="col-3 px-0 text-muted small">{WebUser.tv(cutter)}</div>
                <div className="col-4 px-0 text-muted small">{format(Date.now(), 'yyyy/MM/dd HH:mm')}</div>
            </div>
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