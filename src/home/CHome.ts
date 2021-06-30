import { makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { ReturnCustomerPendingDeliverRet, ReturnWarehouseDeliverMainRet, ReturnWarehousePendingDeliverRet } from "uq-app/uqs/JkDeliver";
import { ReturnWarehousePickupsRet } from "uq-app/uqs/JkWarehouse";
import { VCustomerDeliver } from "./VCustomerDeliver";
import { VDelivering } from "./VDelivering";
import { VDeliverSheet } from "./VDeliverSheet";
import { VHome } from "./VHome";
import { VPicking } from "./VPicking";
import { VPickSheet } from "./VPickSheet";

export interface CustomerPendingDeliver extends ReturnCustomerPendingDeliverRet {
	deliverQuantity: number;
}

export class WarehousePending {
	warehouse: number;
	pickups: ReturnWarehousePickupsRet[];
	deliverMains: ReturnWarehouseDeliverMainRet[];
	constructor() {
		makeObservable(this, {
			pickups: observable.shallow,
			deliverMains: observable.shallow,
		});
	}
	removePickup(pickup: number) {
		if (!this.pickups) return;
		let index = this.pickups.findIndex(v => v.pickup === pickup);
		if (index >=0) this.pickups.splice(index, 1);
	}
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
		let {JkDeliver, JkWarehouse} = this.uqs;
		let [pickups, deliverMains] = await Promise.all([
			JkWarehouse.WarehousePickups.query({}),
			JkDeliver.WarehouseDeliverMain.query({})
		]);
		let coll: {[warehouse:number]: WarehousePending} = {};
		let arr:WarehousePending[] = [];
		function wpFromWarehouse(warehouse: number): WarehousePending {
			let wp = coll[warehouse];
			if (!wp) {
				wp = coll[warehouse] = new WarehousePending();
				wp.warehouse = warehouse;
				wp.pickups = [];
				wp.deliverMains = [];
				arr.push(wp);
			}
			return wp;
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
		let {JkWarehouse} = this.uqs;
		let {pickup} = row;
		let ret = await JkWarehouse.GetPickup.query({pickup});
		let {main, detail} = ret;
		if (main.length === 0) {
			alert(`id ${pickup} 没有取到单据`);
			return;
		}
		let pickupMain = main[0];
		let {picker} = pickupMain;
		let vPageParam = [pickupMain, detail];
		if (this.isMe(picker) === true)
			this.openVPage(VPicking, vPageParam);
		else
			this.openVPage(VPickSheet, vPageParam);
	}

	onDeliverMain = async (row: ReturnWarehouseDeliverMainRet) => {
		let {JkDeliver} = this.uqs;
		let {deliverMain} = row;
		let ret = await JkDeliver.GetDeliver.query({deliver: deliverMain});
		let {main:mainArr, detail} = ret;
		if (mainArr.length === 0) {
			alert(`id ${deliverMain} 没有取到发运单据`);
			return;
		}
		let main = mainArr[0];
		let {staff} = main;
		let vPageParam = [main, detail];
		if (this.isMe(staff) === true)
			this.openVPage(VDelivering, vPageParam);
		else
			this.openVPage(VDeliverSheet, vPageParam);
	}

	async picking(pickupId: number) {
		await this.uqs.JkWarehouse.Picking.submit({pickup: pickupId});
	}

	async donePickup(pickupId: number, 
		pickDetail: {
			orderDetail: number;
			quantity: number;
		}[])
	{
		await this.uqs.JkWarehouse.Picked.submit({
			pickup: pickupId,
			detail: pickDetail
		});
		this.warehousePending.forEach(v => v.removePickup(pickupId));
	}

	async piling(deliverMain: number) {
		await this.uqs.JkDeliver.Piling.submit({deliver: deliverMain});
	}

	async donePileup(deliver: number, 
		detail: {
			id: number;
			quantity: number;
		}[])
	{
		await this.uqs.JkDeliver.DonePileup.submit({
			deliver,
			detail
		});
	}
}
