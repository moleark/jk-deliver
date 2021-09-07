import { LMR, VPage, List } from "tonva-react";
import { ReturnGetCutOffMainDetail, ReturnGetCutOffMainMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import '../deliver/printStyle/TallyList.css';

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

        let { id: mainId } = this.main;
        let { id, trayNumber, product, item, tallyShould, lot } = tallyItem;
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
        let right = <div className="m-auto pr-3">
            <label className="small text-muted">
                <input type="checkbox"
                    defaultChecked={false}
                    onChange={e => this.doneTallyItem(mainId, id, tallyItem.tallyShould)} />
            </label>
        </div>

        return <LMR className="row" key={id} left={left} right={right} onClick={() => this.onClickTallyItem(index)}>
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
                <span className="col-3 pl-1">{lot}</span>
            </div>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">实理：</span >
                <input type="text" className="col-4 form-control px-0 mx-0" onChange={o => tallyItem.tallyShould = o.target.value} defaultValue={tallyShould} />
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

    private async doneTallyItem(cutOffMain: number, orderDetail: number, tallyQuantity: number) {
        alert("cutOffMain：" + cutOffMain + ",orderDetail：" + orderDetail + ",tallyQuantity：" + tallyQuantity);
    }
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}