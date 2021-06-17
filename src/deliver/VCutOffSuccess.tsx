import { VPage, Page } from 'tonva-react';
import { COutBound } from "./COutBound";

export class VCutOffSuccess extends VPage<COutBound> {

    async open(outBoundResult: any) {
        this.openPage(this.page, outBoundResult);
    }

    private page = (outBoundResult: any) => {
        let { openOutBoundOrderDetailPage } = this.controller;

        return <Page header="截单成功" back="close">
            <div className="p-3 bg-white mb-3">
                <div className="mb-3">截单成功！</div>
                <p className="">
                    出库单号: <span onClick={() => openOutBoundOrderDetailPage(outBoundResult.outBoundOrderId)} className="h5 text-info"> {outBoundResult.outBoundOrderId}</span><br /><br />
                    点击单号可跳转到出库单详情界面打印单据。
                </p>
            </div>
        </Page>
    }
}