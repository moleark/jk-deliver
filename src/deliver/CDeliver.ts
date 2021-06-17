import { CApp, CUqBase } from "uq-app";
import { VDeliver } from "./VDeliver";
import { ReturnCustomerPendingDeliverRet, ReturnWarehousePendingDeliverRet } from 'uq-app/uqs/JkDeliver'
import { VCustomerDeliver } from "./VCustomerDeliver";
import { makeObservable, observable } from "mobx";

export interface CustomerPendingDeliver extends ReturnCustomerPendingDeliverRet {
	deliverQuantity: number;
}

export class CDeliver extends CUqBase {
	warehousePendingDeliver: ReturnWarehousePendingDeliverRet[];
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
}
