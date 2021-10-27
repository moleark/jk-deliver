import { LMR, VPage, List, FA } from "tonva-react";
import { ReturnGetCutOffMainDetail, ReturnGetCutOffMainMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import { tvPackx } from "tools/tvPackx";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";

export class VTallying extends VPage<CHome> {
    private main: ReturnGetCutOffMainMain;
    // private genreInput: HTMLInputElement;
    private taskCount: number = 0;
    private currentCount: number = 0;
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
        this.taskCount = detail.length;
    }

    header() { return '理货单：' + this.main.no }

    private renderTallyItem = (tallyItem: any, index: number) => {
        let { JkProduct } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');

        let { deliverMain, deliverDetail, trayNumber, item, tallyShould, tallyDone, tallyState, lotNumber } = tallyItem;
        let pack = PackX.getObj(item);

        let left = <div className="py-1 pl-0 pr-2 bg"><strong>{trayNumber}</strong></div>;  //m-auto
        let isDone: boolean = (tallyState === 0 || tallyState === false) ? false : true;
        tallyItem.tallyState = isDone;
        let right = <div className="m-auto pr-3">
            <label className="small text-muted">
                <input type="checkbox"
                    defaultChecked={isDone}
                    onChange={o => {
                        if (o.target.checked === false) { return };
                        tallyItem.tallyState = o.target.checked;
                        this.currentCount += 1;
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
                <span className="col-5 text-info pr-0">{tallyShould}</span>
                <span className="col-2 text-muted px-1">实理:</span >
                <div className="col-3 form-inline p-0 m-0">
                    <span className="col-1 pl-0" onClick={() => { if (tallyItem.tallyDone > 0) { tallyItem.tallyDone = Number(tallyItem.tallyDone) - 1; } }}>
                        <FA name="minus" className="fa fa-minus-square fa-sm text-info" />
                    </span>
                    {React.createElement(observer(() => {
                        return <input type="text" className="col-6 form-control px-0 mx-0 py-0 my-0 text-info" style={{ height: 'calc(1.0em + 0.5rem + 2px)' }}
                            onChange={o => {
                                tallyItem.tallyDone = o.target.value;
                            }} defaultValue={tallyDone} />
                    }))}
                    <span className="col-1 pl-0" onClick={() => { tallyItem.tallyDone = Number(tallyItem.tallyDone) + 1; }}>
                        <FA name="plus" className="fa fa-plus-square fa-sm text-info" />
                    </span>
                </div>
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
    private searchProductPackByOrigin = async () => {
        let { searchProductPackByOrigin } = this.controller;
        if (!this.controller.genreInput.value) {
            return;
        }
        let result: any = await searchProductPackByOrigin(this.controller.genreInput.value);
        let packList: any[] = [];
        result.forEach((e: any) => {
            packList.push(e.pack.id);
        });
        this.detail = this.detail.filter((e: any) => {
            return packList.find((item: any) => { return item === e.item });
        });
    }

    /**
     * 获取理货单信息
     * @param cutOffMain 
     */
    private getCutOffMain = async (cutOffMain: number) => {
        let { onGetCutOffMain } = this.controller;
        let result = await onGetCutOffMain(cutOffMain);
        result.forEach(element => {
            if (element.tallyState === 0) {
                element.tallyDone = element.tallyShould;
            }
        });
        this.detail = result.sort((a: any, b: any) => a["tallyState"] - b["tallyState"] || a["trayNumber"] - b["trayNumber"]);
    }

    content() {
        let { openBarcodePage } = this.controller;
        let pickTotal: number = 0;
        let { id } = this.main;
        this.detail.forEach(element => {
            pickTotal += element.tallyShould;
            if (element.tallyState === 0) {
                element.tallyDone = element.tallyShould;
            }
        });

        let topLeft = <div><button className="btn btn-primary w-100" style={{ height: 'calc(1.0em + 1.2rem + 2px)', marginRight: '2px' }} onClick={() => this.getCutOffMain(id)}>全部</button>

        </div>
        let topRight = <div className="form-inline" style={{ flexFlow: 'row' }}>
            <button className="btn btn-primary w-50" style={{ height: 'calc(1.0em + 1.2rem + 2px)', marginLeft: '2px' }} onClick={this.searchProductPackByOrigin}><FA name="search" /></button>
            <button className="btn btn-primary w-50" style={{ height: 'calc(1.0em + 1.2rem + 2px)', marginLeft: '2px' }} onClick={openBarcodePage}><FA name="qrcode" /></button>
        </div>
        return <div id="tallyListDiv" className="p-1 bg-white">
            <div className="px-1 py-1 bg-light">
                {React.createElement(observer(() => {
                    return <LMR left={topLeft} right={topRight}>
                        <form onSubmit={(e) => { e.preventDefault(); this.searchProductPackByOrigin() }} >
                            <input ref={v => this.controller.genreInput = v} type="text" placeholder={'输入商品编号'} className="form-control"></input>
                        </form>
                    </LMR>
                }))}
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

        // let isAllCheck: boolean = this.detail.every((e: any) => e.tallyState === true);
        let isAllCheck: boolean = (this.currentCount === this.taskCount) ? true : false;
        if (isAllCheck) {
            await doneTally(warehouse, id);
            this.closePage();
        }
    }

    private async openBarcodePage() {
        let { openBarcodePage } = this.controller;
        await openBarcodePage();
    }

    private async convertProductNumber(code: string) {
        let result: string = '';
        // code = '212583 LQ20U112 Jkchemical 1';  // jk
        // code = 'P:22122020-1-11:05:502410191kgFCB066537';    // fluorochem
        // code = '1P440300250   1TA0377514';    // Acros
        // code = '1PB23830.2     1T10225944';    // Alfa
        // code = '25-1330.2|36051100';    // STREM
        // code = '2212725';
        code = 'EN300-97037';

        let jk_Reg = /^\w*\s\w*\sJkchemical\s1\b/;
        let fluorochem_Reg = /\bP:\d*-\d*-\d*:\w*:\w*\b/;
        let alfa_Reg = /\b1P\d*\.\d\s*\w*\b/;
        let acros_Reg = /\b1P\d*\s*\w*\b/;
        let strem_Reg = /\w*.\d.\w*\b/;
        let lot_Reg = /^\d+$/;  // 纯数字，匹配lot
        let product_Reg = /^\w\.+$/;  // 字母 符号 加数字，匹配产品编号
        // let jk_check = jk_reg.test(code);
        let jk_res = jk_Reg.exec(code);
        if (jk_res !== null && jk_res !== undefined) {
            // console.log(jk_res[0]);
            result = jk_res[0].split(/\s/)[0];
        }
        if (result === '') {
            let fluorochem_res = fluorochem_Reg.exec(code);
            if (fluorochem_res !== null) {
                result = fluorochem_res[0].split(/:/)[3].substring(2, 8);
            }
        }
        if (result === '') {
            let alfa_res = alfa_Reg.exec(code);
            if (alfa_res !== null) {
                result = alfa_res[0].split('.')[0].substring(2);
            }
        }
        if (result === '') {
            let acros_res = acros_Reg.exec(code);
            if (acros_res !== null) {
                result = acros_res[0].split('1T')[0].substring(2);
            }
        }
        if (result === '') {
            let strem_res = strem_Reg.exec(code);
            if (strem_res !== null) {
                result = strem_res[0];
            }
        }
        if (result === '') {
            let lot_res = lot_Reg.exec(code);
            if (lot_res !== null) {
                let productNo: any = await this.getProductNoByLot(lot_res[0]);
                if (productNo.length > 0) {
                    result = productNo.product;
                } else {
                    result = '';
                }
            }
        }
        if (result === '') {
            let product_res = product_Reg.exec(code);
            if (product_res !== null) {
                result = product_res[0];
            }
        }
        console.log(result);
    }
    /**
     * 识别产品编号，作废
     * @param code 
     */
    private async convertProductNumber2(code: string) {
        // code = '212583 LQ20U112 jkchemical 1';  // jk
        // code = 'P:22122020-1-11:05:502410191kgFCB066537';    // fluorochem
        // code = '1P440300250   1TA0377514';    // Acros
        // code = '1PB23830.2     1T10225944';    // Alfa
        // code = '25-1330.2|36051100';    // STREM
        // code = '2212725';
        // let format_code: string = code.replace(/^\s*|\s*$/g, "");
        let result: string = '';

        if (code.indexOf("jkchemical") !== -1) {    // jk
            result = code.split(' ')[0];
        } else if (code.substring(0, 2) === 'P:') { // fluorochem
            let temp_fluorochem: string = code.split(':')[3];
            // let l: RegExp = new RegExp('[/^[a-z|A-Z]+$');
            // let a = l.exec(temp_fluorochem);
            // alert(a);
            // 2410191kgFCB066537  获取存在问题。
            result = temp_fluorochem.substring(2, 8); //temp_fluorochem.substring(2, temp_fluorochem.length);
        } else if (code.substring(0, 2) === '1P' && code.indexOf(" 1T") !== -1) { // Alfa Aesar
            let temp_AlfaAesar: string = code.split('.')[0];
            result = temp_AlfaAesar.substring(2).trimEnd();
        } else if (code.substring(0, 2) === '1P' && code.trim().indexOf("1T") !== -1) { // Acros ? 貌似反馈的规则不对
            let temp_Acros: string = code.split('1T')[0];
            result = temp_Acros.substring(2).trimEnd();
        } else if (code.indexOf("|") !== -1) {  // STREM
            let temp_STREM: string = code.split('.')[0];
            result = temp_STREM.trim();
        } else if (/^\d+$/.test(code) === true) {
            let productNo: any = await this.getProductNoByLot(code);
            if (productNo.length > 0) {
                result = productNo.product;
            } else {
                result = '';
            }
        } else {
            result = code.trim();
        }
        console.log(result);
    }

    private getProductNoByLot = async (lot: string) => {
        let { getProductNoByLot } = this.controller;
        return await getProductNoByLot(lot);
    }
}