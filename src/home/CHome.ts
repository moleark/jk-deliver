import { makeObservable, observable } from "mobx";
import { Controller, ParamIDDetailGet, VPage } from "tonva-react";
import { CApp, CUqBase } from "uq-app";
import { Pickup, PickupDetail, ReturnCustomerPendingDeliverRet, ReturnWarehouseDeliverMainRet, ReturnWarehousePendingDeliverRet, ReturnWarehousePickupsRet } from "uq-app/uqs/JkDeliver";
import { VCustomerDeliver } from "./VCustomerDeliver";
import { VHome } from "./VHome";
import { VPicking } from "./VPicking";
import { VPickup } from "./VPickup";
import { VPrepare } from "./VPrepare";

export interface CustomerPendingDeliver extends ReturnCustomerPendingDeliverRet {
	deliverQuantity: number;
}

export interface WarehousePending {
	warehouse: number;
	delivers: ReturnWarehousePendingDeliverRet[];
	pickups: ReturnWarehousePickupsRet[];
	deliverMains: ReturnWarehouseDeliverMainRet[];
}

export class CHome extends CUqBase {
	warehouse: number;
	customer: number;
	customerOrderDetails: CustomerPendingDeliver[];
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
		let {JkDeliver} = this.uqs;
		let [delivers, pickups, deliverMains] = await Promise.all([
			JkDeliver.WarehousePendingDeliver.query({}),
			JkDeliver.WarehousePickups.query({}),
			JkDeliver.WarehouseDeliverMain.query({})
		]);
		let coll: {[warehouse:number]: WarehousePending} = {};
		let arr:WarehousePending[] = [];
		function wpFromWarehouse(warehouse: number): WarehousePending {
			let wp = coll[warehouse];
			if (!wp) {
				wp = coll[warehouse] = {
					warehouse,
					delivers: [],
					pickups: [],
					deliverMains: [],
				}
				arr.push(wp);
			}
			return wp;
		}
		for (let row of delivers.ret) {
			let {warehouse} = row;
			let wp = wpFromWarehouse(warehouse);
			wp.delivers.push(row);
		}
		for (let row of pickups.ret) {
			let {warehouse} = row;
			let wp = wpFromWarehouse(warehouse);
			wp.pickups.push(row);
		}
		for (let row of deliverMains.ret) {
			let {warehouse} = row;
			let wp = wpFromWarehouse(warehouse);
			wp.deliverMains.push(row);
		}
		this.warehousePending = arr;
	}

	createPickup = async (row: ReturnWarehousePendingDeliverRet) => {
		let {warehouse} = row;
		const pickupMaxRows = 1; // 100;
		let result = await this.uqs.JkDeliver.Pick.submitReturns({warehouse, pickupMaxRows});
		// 下面语句返回带表名的结果。
		// let result = await this.uqs.JkDeliver.Pick.submitReturns({warehouse, maxRows});
		if (!result) {
			alert('no pick created');
			return;
		}
		this.openVPage(VPrepare, result, this.reloadHome);
	}

	private reloadHome = async (ret: any) => {
		await this.load();
	}

	loadCustomerPendingDeliver = async(row: ReturnWarehousePendingDeliverRet) => {
		let {warehouse} = row;
		let customer = 0;
		let ret = await this.uqs.JkDeliver.CustomerPendingDeliver.query({warehouse, customer});
		this.warehouse = warehouse;
		this.customerOrderDetails = ret.ret as CustomerPendingDeliver[];
		this.openVPage(VCustomerDeliver);
	}

	doneDeliver = async () => {
		// let ret = 
		await this.uqs.JkDeliver.DoneDeliver.submit({
			warehouse: this.warehouse,
			customer: this.customer,
			detail: this.customerOrderDetails
				.filter(v => v.deliverQuantity !== undefined)
				.map(v => ({orderDetail:v.orderDetail, quantity: v.deliverQuantity})),
		});
		await this.load();
	}

	onPickup = async (row: ReturnWarehousePickupsRet) => {
		let {JkDeliver} = this.uqs;
		let {pickup: id} = row;
		let param:ParamIDDetailGet = {
			id,
			main: JkDeliver.Pickup,
			detail: JkDeliver.PickupDetail,
		};
		let ret = await JkDeliver.IDDetailGet<Pickup, PickupDetail>(param);
		let [main, detail] = ret;
		if (main.length === 0) {
			alert(`id ${id} 没有取到单据`);
			return;
		}
		let pickupMain = main[0];
		let {picker} = pickupMain;
		let vPageParam = [pickupMain, detail];
		if (this.isMe(picker) === true)
			this.openVPage(VPicking, vPageParam);
		else
			this.openVPage(VPickup, vPageParam);
	}

	onDeliverMain = async (row: ReturnWarehouseDeliverMainRet) => {
		alert(row.deliverMan);
	}

	async startPickup(pickupId: number) {

	}

	async donePickup(pickupId: number) {
		
	}
}
