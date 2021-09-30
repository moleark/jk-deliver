import { LMR, VPage, List } from "tonva-react";
import { ReturnGetCutOffMainDetail, ReturnGetCutOffMainMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import '../deliver/printStyle/TallyList.css';
import { tvPackx } from "tools/tvPackx";

export class VTallying extends VPage<CHome> {
    private main: ReturnGetCutOffMainMain;
    private detail: ReturnGetCutOffMainDetail[];

    init(param: [ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail[]]) {
        let [main, detail] = param;
        this.main = main;
        this.detail = detail;
    }

    header() { return '理货单：' + this.main.no }

    // 修改当前选中行颜色
    private onClickTallyItem = (rowIndex: number) => {

        let tallyListLiDiv = document.getElementById("tallyListDiv").getElementsByTagName("ul")[0].getElementsByTagName("li");
        for (let index = 0; index < tallyListLiDiv.length; index++) {
            if (index == rowIndex) {
                tallyListLiDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFF99";
            } else {
                tallyListLiDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFFFF";
            }
        }
    }

    private renderTallyItem = (tallyItem: any, index: number) => {

        let { JkProduct } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');

        let { delivermain, deliverDetail, trayNumber, product, item, tallyShould, tallyDone, tallyState, lotNumber } = tallyItem;
        let pack = PackX.getObj(item);

        let left = <div className="m-auto px-2 py-1 bg"><strong>{trayNumber}</strong></div>;
        /**
         * <div className="row px-1">
                <label className="text-muted">应理：</label ><span className="text-info">{tallyShould}</span>
            </div>
            <div className="row px-1 text-justify">
                <label className="text-muted">实理：</label >
                <input type="text" className="form-control px-0 mx-0" onChange={o => tallyItem.tallyShould = o.target.value} defaultValue={tallyShould} />
            </div>
         */
        let isDone: boolean = (tallyState === 0) ? false : true;
        tallyItem.tallyState = isDone;
        let right = <div className="m-auto pr-3">
            <label className="small text-muted">
                <input type="checkbox"
                    defaultChecked={isDone}
                    onChange={o => { if (o.target.checked === false) { return }; tallyItem.tallyState = o.target.checked; this.doneTallyItem(delivermain, deliverDetail, tallyItem.tallyShould) }} />
            </label>
        </div>

        return <LMR className="row" key={deliverDetail} left={left} right={right} onClick={() => this.onClickTallyItem(index)}>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">编号: </span>
                <span className="col-5 pl-1">{ProductX.tv(product)} </span>
                <span className="col-2 text-muted px-1">包装: </span>
                <span className="col-3 pl-1">{tvPackx(pack)}</span>
            </div>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">应理：</span >
                <span className="col-5 pl-1 text-info">{tallyShould}</span>
                <span className="col-2 text-muted px-1">Lot: </span>
                <span className="col-3 pl-1">{lotNumber}</span>
            </div>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">实理：</span >
                <input type="text" className="col-4 form-control px-0 mx-0" onChange={o => tallyItem.tallyShould = o.target.value} defaultValue={tallyState === 0 ? tallyShould : tallyDone} />
            </div>
        </LMR>;

        /*<div className="row col-12 py-1">
            <span className="col-2 text-muted px-1">单位: </span>
            <span className="col-5 pl-1">{'xxxx单位'}</span>
            <span className="col-2 text-muted px-1">收货人: </span>
            <span className="col-3 pl-1">{ }</span>
        </div>*/
    };

    content() {

        let pickTotal: number = 0;
        let { id, no } = this.main;
        this.detail.forEach(element => {
            pickTotal += element.tallyShould;
        });

        return <div id="tallyListDiv" className="col-12 bg-white">
            <List items={this.detail} item={{ render: this.renderTallyItem }} none="无理货数据" />
            <div className="float-right py-3">
                <span className="px-2 text-info small">理货总瓶数：<strong>{pickTotal}</strong></span>
            </div>
        </div>;
    }

    /**
     * 单条完成（会判断是否全部勾选，自动触发全部完成）
     * @param delivermain 
     * @param deliverDetail 
     * @param tallyQuantity 
     */
    private async doneTallyItem(delivermain: number, deliverDetail: number, tallyQuantity: number) {
        let { doneTallySingle, doneTally } = this.controller;
        let { warehouse, id } = this.main
        await doneTallySingle(delivermain, deliverDetail, tallyQuantity);

        let isAllCheck: boolean = this.detail.every((e: any) => e.tallyState === true);
        if (isAllCheck) {
            await doneTally(warehouse, id);
            this.closePage();
        }
    }
}