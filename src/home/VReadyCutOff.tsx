import { VPage, LMR, List, DropdownAction, DropdownActions } from "tonva-react";
import { tvPackx } from "tools/tvPackx";
import { CHome } from "./CHome";

export class VReadyCutOffSheet extends VPage<CHome> {

    private readyCutOffList: any[];
    private warehouse: number;
    private cutOffTypeList: any[];
    init(param: any) {
        let { warehouse, taskList, cutOffTypeList } = param;
        this.warehouse = warehouse;
        this.readyCutOffList = taskList;
        this.cutOffTypeList = cutOffTypeList;
    }

    header() { return '待截单列表' }

    /**
     * 截单
     * @param warehouse 库房
     * @param customer 客户id
     * @param tradeType 贸易类型（xx2,xx3,xx4,xx5）
     */
    private onCutOff_将会修改 = async (warehouse: number, customer: number, tradeType: any) => {
        let { onCutOff } = this.controller;
        alert('warehouse:' + warehouse + ',customer:' + customer + ',tradeType:' + tradeType);
        //await onCutOff(warehouse);
    }
    private onCutOff = async (warehouse: number, cutOffType: number) => {
        let { onCutOff } = this.controller;
        await onCutOff(warehouse, cutOffType);
    }

    right() {
        /*
        let actions: DropdownAction[] = [];
        if (this.cutOffTypeList.length) {
            let dropdownAction: any[] = this.cutOffTypeList.map((v: any, index) => {
                return { icon: 'cut', caption: v.name, action: () => this.onCutOff(this.warehouse, v.customer, v.tradetype) };
            });
            actions = dropdownAction;
        }
        return <DropdownActions className="align-self-center mr-2 bg-transparent border-0 text-light" icon="navicon" actions={actions} />;
        */
        return <button className="btn btn-sm btn-primary mr-2" onClick={() => this.onCutOff(this.warehouse, 1)}> 截单类型1</button>;
    }

    private renderReadyCutOffItem = (cutOffItem: any) => {

        let { JkProduct, JkCustomer, JkWarehouse } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');
        //let { Customer, Department } = JkCustomer;
        //let { Warehouse } = JkWarehouse;

        let { item, shouldQuantity, customer } = cutOffItem;
        let pack = PackX.getObj(item);

        return <LMR className="px-1 py-1">
            <div className="row col-12 py-1">
                <span className="col-4 pl-1">{ProductX.tv(pack.owner)}</span>
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