import { observer } from "mobx-react";
import React from "react";
import { List, VPage, LMR, FA } from "tonva-react";
import { ReturnWarehouseCutOffMainRet, ReturnWarehouseDeliverMainRet } from "uq-app/uqs/JkDeliver";
import { ReturnWarehousePickupsRet } from "uq-app/uqs/JkWarehouse/JkWarehouse";
import { CHome } from "./CHome";

export class VHome extends VPage<CHome> {
    header() { return '首页' }
    content() {
        return React.createElement(observer(() => {
            // 这个页面每10秒刷一次。因为很少人用，每次数据库查询很小
            let { uqs, warehousePending, onOpenCutOffPage, onOpenCutOffHistory, onCutOffMain, onPickup, onDeliverMain } = this.controller;
            let { JkWarehouse } = uqs;
            let content: any;
            if (!warehousePending) {
                content = <FA name="spinner" spin={true} className="text-info mx-3" size="lg" />;
            }
            else {
                content = warehousePending.map(v => {
                    let { warehouse, readyCutOffs, cutOffMains, pickups, deliverMains } = v;
                    return <div key={warehouse} className="my-3">
                        <div className="my-1 px-2 text-info font-weight-bold">
                            {JkWarehouse.Warehouse.tv(warehouse)} &nbsp;&nbsp;
                            <span className="small text-muted">待截单</span><span className="small text-danger"
                                onClick={() => onOpenCutOffPage(warehouse)}>
                                {readyCutOffs.length}
                            </span>
                            <span className="small float-right mr-1" onClick={() => onOpenCutOffHistory(warehouse)}>
                                <FA className="mr-1 cursor-pointer text-muted" name="ellipsis-v" />
                            </span>
                        </div>
                        <List className="my-1" items={cutOffMains} none="无理货单"
                            item={{ render: this.renderCutOffMain, onClick: onCutOffMain }} />
                        <List className="my-1" items={pickups} none="无拣货单"
                            item={{ render: this.renderPickup, onClick: onPickup }} />
                        <List className="my-1" items={deliverMains} none="无发运单"
                            item={{ render: this.renderDeliverMain, onClick: onDeliverMain }} />
                    </div>
                });
            }
            return <div className="my-3">{content}</div>;
        }));
        // <List className="mb-3" items={delivers} none="无发货指令"
        // 	item={{render: this.renderPending, onClick: createPickup}} />
    }


    private renderCutOffMain = (row: ReturnWarehouseCutOffMainRet, index: number): JSX.Element => {
        let { no, staff } = row;
        let left = <div className="w-5c text-info">理货单</div>;
        let right: any;
        right = (staff) ?
            <span className="text-success">{this.renderUser(staff)} </span>
            :
            <span className="text-danger">待处理</span>;
        return <LMR className="px-3 py-2" left={left} right={right}>
            <b>{no}</b>
        </LMR>
    }

    private renderPickup = (row: ReturnWarehousePickupsRet, index: number): JSX.Element => {
        let { no, picker } = row;
        let left = <div className="w-5c text-success">拣货单</div>;
        let right: any;
        right = (picker) ?
            <span className="text-success">{this.renderUser(picker)}</span>
            :
            <span className="text-danger">待处理</span>;
        return <LMR className="px-3 py-2" left={left} right={right}>
            <b>{no}</b>
        </LMR>
    }

    private renderDeliverMain = (row: ReturnWarehouseDeliverMainRet, index: number): JSX.Element => {
        let { JkCustomer } = this.controller.uqs;
        let { Customer, BuyerAccount } = JkCustomer;
        let { deliverMain, no, customerAccount, create, rows, pickRows, staff } = row;
        let left = <div className="w-5c text-primary">发运单</div>;
        /*let right = pickRows === rows ?
            (staff ?
                    <span>{this.renderUser(staff)} <span className="text-success">发前确认</span></span>
                    :
                    <span className="text-danger">可发运</span>
            ):<span className="text-muted">待拣货</span>;*/
        let right = staff ?
            <span className="text-success">{this.renderUser(staff)}</span>
            :
            <span className="text-danger">待处理</span>;

        return <LMR className="px-3 py-2" left={left} right={right}>
            <b>{no}</b> &nbsp;
            <span className="small text-muted">{BuyerAccount.tv(customerAccount)}</span>
        </LMR>
    }
}