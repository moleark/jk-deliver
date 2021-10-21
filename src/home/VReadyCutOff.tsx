import { VPage, LMR, List, Scroller } from "tonva-react";
import { tvPackx } from "tools/tvPackx";
import { CHome } from "./CHome";
import classNames from 'classnames';
import { observer } from "mobx-react";
import React from "react";
import { makeObservable, observable } from "mobx";

export class VReadyCutOffSheet extends VPage<CHome> {

    private warehouse: number;
    private cutOffTypeList: any[];
    cutOffType: number;
    constructor(cApp: CHome) {
        super(cApp);
        makeObservable(this, {
            cutOffType: observable
        });
    }

    init(param: any) {
        let { warehouse, cutOffTypeList } = param;
        this.warehouse = warehouse;
        this.cutOffTypeList = cutOffTypeList;
        this.controller.readyCutOffTaskList = null;
    }

    header() { return '待截单列表' }

    /**
     * 截单
     * @param warehouse 库房
     * @param tradeType 贸易类型（xx2,xx3,xx4,xx5）
     */
    private onCutOff = async (warehouse: number, cutOffType: number) => {
        if (cutOffType !== 0 || cutOffType !== undefined) {
            let { onCutOff } = this.controller;
            await onCutOff(warehouse, cutOffType);
        }
    }

    /**
     * 分页处理
     * @param scroller 
     */
    onPageScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        this.controller.readyCutOffTaskList.more();
    }

    right() {
        /*let actions: DropdownAction[] = [];
        if (this.cutOffTypeList.length) {
            let dropdownAction: any[] = this.cutOffTypeList.map((v: any, index) => {
                return { icon: 'cut', caption: v.name, action: () => this.onCutOff(this.warehouse, v.cutOffType) };
            });
            actions = dropdownAction;
        }
        return <DropdownActions className="align-self-center mr-2 bg-transparent border-0 text-light" icon="navicon" actions={actions} />;*/
        return <button className="btn btn-sm btn-primary mr-2" onClick={() => this.onCutOff(this.warehouse, this.cutOffType)}> 截单</button>;
    }

    /**
     * 加载截单任务明细
     * @param cutOffItem 
     * @returns 
     */
    private renderReadyCutOffItem = (cutOffItem: any) => {
        let { JkProduct } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');

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

    /**
     * 加载截单类型明细
     * @param data 
     * @returns 
     */
    private rendercutOffTypeItem = (data: any) => {
        let { cutOffType, name } = data;
        return React.createElement(observer(() => {
            return <span className={classNames(this.cutOffType === cutOffType ? 'text-light bg-primary' : 'text-primary', 'm-1 border-primary border py-1 px-2 rounded-lg small')}
                onClick={() => this.selectCutOffType(cutOffType)} >
                {name}
            </span >;
        }
        ));
    };

    /**
     * 选择截单类型
     * @param cutOffType 
     */
    private selectCutOffType = async (cutOffType: number) => {
        this.cutOffType = cutOffType;
        let { onLoadReadyCutOffList } = this.controller;
        await onLoadReadyCutOffList(this.warehouse, cutOffType);
    }

    content() {
        return <div>
            <div className="border-bottom mb-1 bg-light pt-1" style={{ borderBottom: '1px dashed rgb(222, 226, 230)' }}>
                <List items={this.cutOffTypeList} item={{ render: this.rendercutOffTypeItem }} className="d-flex bg-white w-100 flex-wrap" none="暂无截单类型" />
            </div>
            <div id="pickListDiv" className="p-1">
                {React.createElement(observer(() => {
                    if (!this.controller.readyCutOffTaskList?.items?.length) return null;
                    return <List before={""} items={this.controller.readyCutOffTaskList} item={{ render: this.renderReadyCutOffItem }} none="无截单数据" />
                }))}
            </div>
        </div>;
    }
}