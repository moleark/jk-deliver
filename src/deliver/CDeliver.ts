import { CApp, CUqBase } from "uq-app";
import { VDeliver } from "./VDeliver";
import { ReturnCustomerPendingDeliverRet } from 'uq-app/uqs/JkDeliver'
import { VCustomerDeliver } from "./VCustomerDeliver";
import { makeObservable, observable } from "mobx";

export interface WarehousePendingDeliver {
	warehouse: number;
	customer: number;
	rowCount: number;
}

export interface CustomerPendingDeliver extends ReturnCustomerPendingDeliverRet {
	deliverQuantity: number;
}

export class CDeliver extends CUqBase {
	warehousePendingDeliver: WarehousePendingDeliver[];
	warehouse: number;
	customer: number;
	customerOrderDetails: CustomerPendingDeliver[];

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			warehousePendingDeliver: observable,
		});
	}

	protected async internalStart() {
	}

	tab = () => this.renderView(VDeliver);

	load = async () => {
		let ret = await this.uqs.JkDeliver.WarehousePendingDeliver.query({});
		this.warehousePendingDeliver = ret.ret;
	}

	loadCustomerPendingDeliver = async(row: WarehousePendingDeliver) => {
		let {warehouse, customer} = row;
		let ret = await this.uqs.JkDeliver.CustomerPendingDeliver.query({warehouse, customer});
		this.warehouse = warehouse;
		this.customer = customer;
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
}
