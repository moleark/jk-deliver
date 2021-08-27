import { tv, Page, VPage, LMR, List } from "tonva-react";
import { CHome } from "./CHome";

export class VReadyCutOffSheet extends VPage<CHome> {

    private readyCutOffList: any[];
    private warehouse: number;
    init(param: any) {
        let { warehouse, taskList } = param;
        this.warehouse = warehouse;
        this.readyCutOffList = taskList;
    }

    header() { return '待截单列表' }
    right() {
        let { onCutOff } = this.controller;
        return <button className="btn btn-sm btn-primary mr-2" onClick={() => onCutOff(this.warehouse)}> 截单</button>;
    }

    private renderReadyCutOffItem = (cutOffItem: any) => {

        let { JkProduct, JkCustomer, JkWarehouse } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');
        //let { Customer, Department } = JkCustomer;
        //let { Warehouse } = JkWarehouse;

        let { orderDetail, product, item, shouldQuantity, customer } = cutOffItem;
        let pack = PackX.getObj(item);


        return <LMR className="px-1 py-1">
            <div className="row col-12 py-1">
                <span className="col-4 pl-1">{ProductX.tv(product)}</span>
                <span className="col-4 pl-1">{tvPackx(pack)}</span>
                <span className="col-4 pl-1">{shouldQuantity}</span>
            </div>
        </LMR>;
    }

    content() {

        let cutOffTotal: number = 0;
        if (this.readyCutOffList.length > 0) {
            this.readyCutOffList.forEach((element: { shouldQuantity: number; }) => {
                cutOffTotal += element.shouldQuantity;
            });
        }

        return <div id="pickListDiv" className="p-1 bg-white">
            <List items={this.readyCutOffList} item={{ render: this.renderReadyCutOffItem }} none="无截单数据" />
            <div className="float-right py-3">
                <span className="px-2 text-info small">总瓶数：<strong>{cutOffTotal}</strong></span>
            </div>
        </div>;
    }
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}