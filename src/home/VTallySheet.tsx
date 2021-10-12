import { VPage } from "tonva-react";
import { ReturnGetCutOffMainDetail, ReturnGetCutOffMainMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import { VTallying } from "./VTallying";

export class VTallySheet extends VPage<CHome> {
    private main: ReturnGetCutOffMainMain;
    private detail: ReturnGetCutOffMainDetail[];

    init(param: [ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail[]]) {
        let [main, detail] = param;
        this.main = main;
        this.detail = detail;
    }

    header() {
        return '理货单'
    }

    content() {
        // let { JkDeliver } = this.controller.uqs;
        let { id, no, staff } = this.main;

        let pickTotal: number = 0;
        this.detail.forEach(element => {
            pickTotal += element.tallyShould;
        });

        return <div className="p-3 px-1 py-1">

            <div className="row col-12 px-1 py-1 float-left">
                <span><strong>{no}</strong></span>
            </div>
            <div className="row col-12 px-1 py-1 float-left">
                <span className="text-info small">应理货总瓶数：<strong>{pickTotal}</strong></span>
            </div>
            <div className="row col-12 px-1 py-1">
                {
                    !staff && <div className="my-3">
                        <button className="btn btn-success" onClick={() => this.tallying(id)}>开始理货</button>
                    </div>
                }
            </div>
        </div>;
    }

    /**
     * 开始理货
     * @param cutOffMain 截单号
     */
    private tallying = async (cutOffMain: number) => {
        await this.controller.tallying(cutOffMain);
        this.closePage();
        this.openVPage(VTallying, [this.main, this.detail])
    }
}