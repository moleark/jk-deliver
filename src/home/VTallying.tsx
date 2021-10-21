import { LMR, VPage, List, FA } from "tonva-react";
import { ReturnGetCutOffMainDetail, ReturnGetCutOffMainMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import { tvPackx } from "tools/tvPackx";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";

export class VTallying extends VPage<CHome> {
    private main: ReturnGetCutOffMainMain;
    private genreInput: HTMLInputElement;
    detail: ReturnGetCutOffMainDetail[];
    constructor(cApp: CHome) {
        super(cApp);
        makeObservable(this, {
            detail: observable
        });
    }

    init(param: [ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail[]]) {
        let [main, detail] = param;
        this.main = main;
        // 数据按照是否完成 和 ?(暂时是trayNumber，应该是产品编号) 来排序；
        this.detail = detail.sort((a: any, b: any) => a["tallyState"] - b["tallyState"] || a["trayNumber"] - b["trayNumber"]);
        console.log(this.detail);
    }

    header() { return '理货单：' + this.main.no }

    private renderTallyItem = (tallyItem: any, index: number) => {
        let { JkProduct } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');

        let { deliverMain, deliverDetail, trayNumber, item, tallyShould, tallyDone, tallyState, lotNumber } = tallyItem;
        let pack = PackX.getObj(item);

        let left = <div className="py-1 pl-1 pr-3 bg"><strong>{trayNumber}</strong></div>;  //m-auto
        let isDone: boolean = (tallyState === 0 || tallyState === false) ? false : true;
        tallyItem.tallyState = isDone;
        let right = <div className="m-auto pr-3">
            <label className="small text-muted">
                <input type="checkbox"
                    defaultChecked={isDone}
                    onChange={o => {
                        if (o.target.checked === false) { return };
                        tallyItem.tallyState = o.target.checked;
                        this.doneTallyItem(deliverMain, deliverDetail, tallyDone);
                        this.detail.sort((a: any, b: any) => a["tallyState"] - b["tallyState"] || a["trayNumber"] - b["trayNumber"]);
                    }} />
            </label>
        </div>

        return <LMR className="py-1 border-top border-light" key={deliverDetail} left={left} right={right}
            style={isDone === true ? { backgroundColor: "#C1FFC1" } : {}}>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">编号:</span>
                <span className="col-5 pl-1">{ProductX.tv(pack.owner)} </span>
                <span className="col-2 text-muted px-1">包装:</span>
                <span className="col-3 pl-1">{tvPackx(pack)}</span>
            </div>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">Lot:</span>
                <span className="col-9 pl-1">{lotNumber}</span>
            </div>
            <div className="row col-12 py-1">
                <span className="col-2 text-muted px-1">应理:</span >
                <span className="col-5 pl-1 text-info">{tallyShould}</span>
                <span className="col-2 text-muted px-1">实理:</span >
                <input type="text" className="col-2 form-control px-1 mx-0 py-0 my-0 text-info" style={{ height: 'calc(1.0em + 0.5rem + 2px)' }}
                    onChange={o => {
                        tallyItem.tallyDone = o.target.value;
                    }} defaultValue={tallyDone}
                />
            </div>
        </LMR>;
        /*<div className="row col-12 py-1">
            <span className="col-2 text-muted px-1">单位: </span>
            <span className="col-5 pl-1">{'xxxx单位'}</span>
            <span className="col-2 text-muted px-1">收货人: </span>
            <span className="col-3 pl-1">{ }</span>
        </div>*/
    };

    /**
     * 查询产品
     * @param productNo 
     */
    private searchProduct = async () => {
        let { searchProductPackByOrigin } = this.controller;
        if (!this.genreInput.value) {
            return;
        }
        console.log(this.genreInput.value);
        let result: any = await searchProductPackByOrigin(this.genreInput.value);
        console.log(result);
    }

    content() {
        let pickTotal: number = 0;
        // let { id, no } = this.main;
        this.detail.forEach(element => {
            pickTotal += element.tallyShould;
            if (element.tallyState === 0) {
                element.tallyDone = element.tallyShould;
            }
        });

        let topRight = <button className="btn btn-primary w-100" onClick={this.searchProduct}><FA name="search" /></button>
        return <div id="tallyListDiv" className="p-1 bg-white">
            <div className="px-1 py-1 bg-light">
                <LMR right={topRight}>
                    <form onSubmit={(e) => { e.preventDefault(); this.searchProduct() }} >
                        <input ref={v => this.genreInput = v} type="text" placeholder={'输入商品编号'} className="form-control"></input>
                    </form>
                </LMR>
            </div>
            <div className="px-1 pb-1 bg-light" style={{ borderBottom: '1px dashed #dee2e6' }}>
                <span className="px-1 text-info small">应理货总瓶数：<strong>{pickTotal}</strong></span>
            </div>
            {React.createElement(observer(() => {
                return <List items={this.detail} item={{ render: this.renderTallyItem }} none="无理货数据" />
            }))}
        </div>;
    }

    /**
     * 单条完成（会判断是否全部勾选，自动触发全部完成）
     * @param delivermain 
     * @param deliverDetail 
     * @param tallyQuantity 
     */
    private async doneTallyItem(deliverMain: number, deliverDetail: number, tallyDone: number) {
        let { doneTallySingle, doneTally } = this.controller;
        let { warehouse, id } = this.main
        await doneTallySingle(deliverMain, deliverDetail, tallyDone);

        let isAllCheck: boolean = this.detail.every((e: any) => e.tallyState === true);
        if (isAllCheck) {
            await doneTally(warehouse, id);
            this.closePage();
        }
    }
}