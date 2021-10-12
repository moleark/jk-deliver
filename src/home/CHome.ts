import { QueryPager } from "tonva-react";
import { makeObservable, observable } from "mobx";
import { CApp, CUqBase, JkDeliver } from "uq-app";
import { ReturnWarehouseCutOffMainRet, ReturnWarehouseDeliverMainRet } from "uq-app/uqs/JkDeliver";
import { ReturnWarehousePickupsRet } from "uq-app/uqs/JkWarehouse/JkWarehouse";
import { VDelivering } from "./VDelivering";
import { VDeliverSheet } from "./VDeliverSheet";
import { VHome } from "./VHome";
import { VReadyCutOffSheet } from "./VReadyCutOff";
import { VCutOffSuccess } from "../deliver/VCutOffSuccess";
import { VTallying } from "./VTallying";
import { VTallySheet } from "./VTallySheet";
import { VPicking } from "./VPicking";
import { VPickSheet } from "./VPickSheet";

export class WarehousePending {
    warehouse: number;
    cutOffMains: ReturnWarehouseCutOffMainRet[];
    pickups: ReturnWarehousePickupsRet[];
    deliverMains: ReturnWarehouseDeliverMainRet[];

    constructor() {
        makeObservable(this, {
            cutOffMains: observable.shallow,
            pickups: observable.shallow,
            deliverMains: observable.shallow,
        });
    }
    removeCutOffMain(cutOff: number) {
        if (!this.cutOffMains) return;
        let index = this.cutOffMains.findIndex(v => v.cutOffMain === cutOff);
        if (index >= 0) this.cutOffMains.splice(index, 1);
    }
    removePickup(pickup: number) {
        if (!this.pickups) return;
        let index = this.pickups.findIndex(v => v.pickup === pickup);
        if (index >= 0) this.pickups.splice(index, 1);
    }
    removeDeliver(id: number) {
        if (!this.deliverMains) return;
        let index = this.deliverMains.findIndex(v => v.deliverMain === id);
        if (index >= 0) this.deliverMains.splice(index, 1);
    }
}

export class CHome extends CUqBase {
    warehouse: number;
    customer: number;
    // customerOrderDetails: CustomerPendingDeliver[];
    warehousePending: WarehousePending[];

    constructor(cApp: CApp) {
        super(cApp);
        makeObservable(this, {
            warehousePending: observable.shallow,
        });
    }
    protected async internalStart() {
    }

    tab = () => this.renderView(VHome);

    load = async () => {
        let { JkDeliver, JkWarehouse } = this.uqs;
        let [cutOffMains, pickups, deliverMains] = await Promise.all([
            JkDeliver.WarehouseCutOffMain.query({}),
            JkWarehouse.WarehousePickups.query({}),
            JkDeliver.WarehouseDeliverMain.query({})
        ]);
        let coll: { [warehouse: number]: WarehousePending } = {};
        let arr: WarehousePending[] = [];
        function wpFromWarehouse(warehouse: number): WarehousePending {
            let wp = coll[warehouse];
            if (!wp) {
                wp = coll[warehouse] = new WarehousePending();
                wp.warehouse = warehouse;
                wp.cutOffMains = [];
                wp.pickups = [];
                wp.deliverMains = [];
                arr.push(wp);
            }
            return wp;
        }
        for (let row of cutOffMains.ret) {
            let { warehouse, cutOffMain } = row;
            let wp = wpFromWarehouse(warehouse);
            if (cutOffMain) {
                wp.cutOffMains.push(row);
            }
        }
        for (let row of pickups.ret) {
            let { warehouse, pickup } = row;
            let wp = wpFromWarehouse(warehouse);
            if (pickup) {
                wp.pickups.push(row);
            }
        }
        for (let row of deliverMains.ret) {
            let { warehouse, deliverMain } = row;
            let wp = wpFromWarehouse(warehouse);
            if (deliverMain) {
                wp.deliverMains.push(row);
            }
        }
        arr.sort((a, b) => a.warehouse - b.warehouse);
        this.warehousePending = arr;
    }
    /*
        loadCustomerPendingDeliver = async(row: ReturnWarehousePendingDeliverRet) => {
            let {warehouse} = row;
            let customer = 0;
            let ret = await this.uqs.JkDeliver.CustomerPendingDeliver.query({warehouse, customer});
            this.warehouse = warehouse;
            this.customerOrderDetails = ret.ret as CustomerPendingDeliver[];
            this.openVPage(VCustomerDeliver);
        }
    */

    /**
     * 打开截单界面
     * @param warehouse 库房
     */
    onOpenCutOffPage = async (warehouse: number) => {
        let { JkDeliver } = this.uqs;
        let cutOffType: number = 1;
        let readyCutOffRet = await JkDeliver.GetReadyCutOffList.query({ warehouse, cutOffType });
        let cutOffTypeRet = { "截单类型1": "1", "截单类型2": "2" };	// await JkDeliver.GetCutOffTypeList.query({})
        let vPageParam = { warehouse: warehouse, taskList: readyCutOffRet.list, cutOffTypeList: cutOffTypeRet };
        this.openVPage(VReadyCutOffSheet, vPageParam);
    }

    /**
     * 打开截单历史界面
     * @param warehouse 库房
     */
    onOpenCutOffHistory = async (warehouse: number) => {
        let { JkDeliver } = this.uqs;
        let cutOffMainLists: QueryPager<any> = new QueryPager<any>(JkDeliver.GetCutOffMainList, 15, 15);
        await cutOffMainLists.first({ warehouse });
        let vPageParam = { warehouse: warehouse, historyList: cutOffMainLists };
        this.cApp.cDeliver.openCutOffHistory(vPageParam);
    }

    /**
     * 截单
     * @param warehouse 库房
     * @param cutOffType 截单类型
     * @returns 
     */
    onCutOff = async (warehouse: number, cutOffType: number) => {
        let { JkDeliver } = this.uqs;
        let ret = await JkDeliver.CutOff.submit({ aWarehouse: warehouse, cutOffType: cutOffType });
        let { id, no } = ret;
        if (id === undefined) {
            alert(`当前截单失败！`);
            return;
        }
        let vPageParam = { id: id, no: no };
        this.backPage();
        //let vPageParam = { id: 107, no: 2110120001 };
        this.openVPage(VCutOffSuccess, vPageParam);
    }

    /**
     * 打开理货单处理界面
     * @param row 截单信息
     * @returns error
     */
    onCutOffMain = async (row: ReturnWarehouseCutOffMainRet) => {
        let { JkDeliver } = this.uqs;
        let { cutOffMain } = row;
        let ret = await JkDeliver.GetCutOffMain.query({ cutOffMain });
        let { main, detail } = ret;
        if (main.length === 0) {
            alert(`id ${cutOffMain} 没有取到单据`);
            return;
        }
        let pickupMain = main[0];
        let { staff } = pickupMain;
        let vPageParam = [pickupMain, detail];
        if (this.isMe(staff) === true)
            this.openVPage(VTallying, vPageParam);
        else
            this.openVPage(VTallySheet, vPageParam);
    }

    /**
     * 打开拣货单处理界面
     * @param row 拣货单信息
     * @returns error
     */
    onPickup = async (row: ReturnWarehousePickupsRet) => {
        let { JkWarehouse } = this.uqs;
        let { pickup } = row;
        let ret = await JkWarehouse.GetPickup.query({ pickup });
        let { main, detail } = ret;
        if (main.length === 0) {
            alert(`id ${pickup} 没有取到单据`);
            return;
        }
        let pickupMain = main[0];
        let { picker } = pickupMain;
        let vPageParam = [pickupMain, detail];
        if (this.isMe(picker) === true)
            this.openVPage(VPicking, vPageParam);
        else
            this.openVPage(VPickSheet, vPageParam);
    }

    /**
     * 打开发货单处理界面
     * @param row 发货单信息
     * @returns 
     */
    onDeliverMain = async (row: ReturnWarehouseDeliverMainRet) => {
        let { JkDeliver } = this.uqs;
        let { deliverMain } = row;
        let ret = await JkDeliver.GetDeliver.query({ deliver: deliverMain });
        let { main: mainArr, detail } = ret;
        if (mainArr.length === 0) {
            alert(`id ${deliverMain} 没有取到发运单据`);
            return;
        }

        let promises: PromiseLike<any>[] = [];
        mainArr.forEach((element: any) => {
            promises.push(this.cApp.cDeliver.getContant(88750 || element.contact).then(data => element.contactDetail = data));
        });

        detail.forEach((element: any) => {
            promises.push(this.getProductExtention(element.product).then(data => element.productExt = data));
        });
        await Promise.all(promises);

        let main = mainArr[0];
        let { staff } = main;
        let vPageParam = [main, detail];
        if (this.isMe(staff) === true)
            this.openVPage(VDelivering, vPageParam);
        else
            this.openVPage(VDeliverSheet, vPageParam);
    }

    /**
     * 开始理货
     * @param cutOffMain 截单号
     */
    async tallying(cutOffMain: number) {
        await this.uqs.JkDeliver.Tallying.submit({ cutOffMain: cutOffMain });
    }

    /**
     * 单条理货完成
     * @param deliverMain 截单号
     * @param deliverDetail 发货单明细id
     * @param quantity 理货数
     */
    doneTallySingle = async (deliverMain: number, deliverDetail: number, quantity: number) => {
        let { JkDeliver } = this.uqs;
        await JkDeliver.TallyDoneSingle.submit({
            deliverMain: deliverMain,
            deliverDetail: deliverDetail,
            quantity: quantity
        });
    }

    /**
     * 整体理货完成
     * @param warehouse 库房
     * @param cutOffMain 觉但号
     */
    doneTally = async (warehouse: number, cutOffMain: number) => {
        let { JkDeliver } = this.uqs;
        await JkDeliver.TallyDone.submit({
            // warehouse: warehouse,
            cutOffMain: cutOffMain
            // cutOffType: cutOffType
        });
        this.warehousePending.forEach(v => v.removeCutOffMain(cutOffMain));
    }

    /**
     * 开始拣货
     * @param pickupId 拣货单号
     */
    async picking(pickupId: number) {
        await this.uqs.JkWarehouse.Picking.submit({ pickup: pickupId });
    }

    /**
     * 单条拣货完成
     * @param pickupDetail 拣货明细id
     * @param quantity 拣货数
     */
    donePickSingle = async (pickupDetail: number, quantity: number) => {
        let { JkWarehouse } = this.uqs;
        await JkWarehouse.PickedSingle.submit({ pickupDetail: pickupDetail, quantity: quantity });
    }

    /**
     * 
     * @param pickupId 拣货单号
     * @param pickDetail 拣货单明细 Array
     */
    donePickup = async (pickupId: number,
        pickDetail: {
            deliverDetail: number;
            quantity: number;
        }[]) => {
        await this.uqs.JkWarehouse.Picked.submit({
            pickup: pickupId,
            detail: pickDetail
        });
        this.warehousePending.forEach(v => v.removePickup(pickupId));
    }

    /**
     * 开始包装发货
     * @param deliverMain 发货单号
     */
    async Delivering(deliverMain: number) {
        await this.uqs.JkDeliver.Delivering.submit({ deliver: deliverMain });
    }

    /**
     * 包装发货完成
     * @param deliver 发货单号
     * @param detail 发货明细Array
     */
    async doneDeliver(deliver: number,
        detail: {
            id: number;
            orderDetail: number;
            deliverShould: number;
        }[]) {
        await this.uqs.JkDeliver.Delivered.submit({
            deliver,
            detail: detail.map(v => ({ deliverDetail: v.id, orderDetail: v.orderDetail, quantity: v.deliverShould }))
        });
        this.warehousePending.forEach(v => v.removeDeliver(deliver));
        // await this.load();
    }
    /*
    doneDeliver = async (detail:{id:number;deliverDone:number}[]) => {
        await this.uqs.JkDeliver.DoneDeliver.submit({
            warehouse: this.warehouse,
            customer: this.customer,
            detail: this.customerOrderDetails
                .filter(v => v.deliverQuantity !== undefined)
                .map(v => ({orderDetail:v.orderDetail, quantity: v.deliverQuantity})),
        });
        await this.load();
    }
    */

    /**
     * 获取产品扩展信息
     * @param product 
     * @returns 返回产品扩展信息
     */
    getProductExtention = async (product: number) => {
        let { JkProduct } = this.uqs;
        let extention = await JkProduct.ProductExtention.obj({ product: product }); // 56998
        return extention?.content;
    }
}