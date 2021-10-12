import { VPage, Page } from 'tonva-react';
import { CDeliver } from "./CDeliver";

export class VCutOffSuccess extends VPage<CDeliver> {

    async open(cutOffMain: any) {
        this.openPage(this.page, cutOffMain);
    }

    private page = (cutOffMain: any) => {

        let { onOpenCutOffDetail } = this.controller.cApp.cDeliver;
        return <Page header="截单成功" back="close">
            <div className="p-3 bg-white mb-3">
                <div className="mb-3">截单成功！</div>
                <p className="">
                    截单号: <span onClick={() => onOpenCutOffDetail(cutOffMain.id)} className="h5 text-info"> {cutOffMain.no}</span><br /><br />
                    点击单号可跳转到详情界面统一打印单据。
                </p>
            </div>
        </Page>
    }
}