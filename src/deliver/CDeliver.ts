import { CApp, CUqBase } from "uq-app";
import { VDeliver } from "./VDeliver";
import { ReturnCustomerPendingDeliverRet, ReturnWarehousePendingDeliverRet } from 'uq-app/uqs/JkDeliver'
import { VCustomerDeliver } from "./VCustomerDeliver";
import { makeObservable, observable } from "mobx";
import { VReceiptList } from "./VReceiptList";
import { ReturnGetExpressLogisticsListRet } from "uq-app/uqs/JkWarehouse";
import { VCutOffSheetDetail } from "./VCutOffSheetDetail";
import { VCutOffHistory } from "./VCutOffHistory";

export interface CustomerPendingDeliver extends ReturnCustomerPendingDeliverRet {
	deliverQuantity: number;
}

export class CDeliver extends CUqBase {
	warehousePendingDeliver: ReturnWarehousePendingDeliverRet[];
	warehouse: number;
	customer: number;
	customerOrderDetails: CustomerPendingDeliver[];
	expressLogisticsList: ReturnGetExpressLogisticsListRet[];

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

	loadCustomerPendingDeliver = async (row: ReturnWarehousePendingDeliverRet) => {
		let { warehouse } = row;
		let customer = 0;
		let ret = await this.uqs.JkDeliver.CustomerPendingDeliver.query({ warehouse, customer });
		this.warehouse = warehouse;
		this.customerOrderDetails = ret.ret as CustomerPendingDeliver[];
		this.openVPage(VCustomerDeliver);
	}

	doneDeliver = async () => {
		// let ret = 
		/*await this.uqs.JkDeliver.DoneDeliver.submit({
			warehouse: this.warehouse,
			customer: this.customer,
			detail: this.customerOrderDetails
				.filter(v => v.deliverQuantity !== undefined)
				.map(v => ({orderDetail:v.orderDetail, quantity: v.deliverQuantity})),
		});*/
		await this.load();
	}
	/**
	 * 打开回执单打印界面
	 * @param main 
	 * @param detail 
	 */
	openDeliveryReceiptList = async (main: any, detail: any) => {
		let vPageParam = [main, detail]
		this.openVPage(VReceiptList, vPageParam);
	}

	/**
	 * 打开截单历史界面
	 * @param vPageParam 
	 */
	openCutOffHistory = async (vPageParam: any) => {
		this.openVPage(VCutOffHistory, vPageParam);
	}

	/**
	 *  打开截单详情界面，去统一打印单据
	 * @param cutOffMain 
	 */
	onOpenCutOffDetail = async (cutOffMain: number) => {

		let { JkDeliver, JkWarehouse } = this.uqs;
		let ret = await JkDeliver.GetCutOffMain.query({ cutOffMain });
		let { main, detail } = ret;
		this.expressLogisticsList = await JkWarehouse.GetExpressLogisticsList.table('');
		// let shouldExpressLogisticsArray: any[];

		let promises: PromiseLike<any>[] = [];
		detail.forEach((element: any) => {
			promises.push(this.getCustomerOrganization(element.customerAccount).then(data => element.organization = data));
			promises.push(this.getProductExtention(375209 /*element.product*/).then(data => element.productExt = data));
			promises.push(this.getContant(88750 || element.contact).then(data => element.contactDetail = data));
			promises.push(this.getProduct(88750 || element.product).then(data => element.productDetail = data));
		});
		await Promise.all(promises);
		let cutOff = main[0];
		let vPageParam = [cutOff, detail];
		this.openVPage(VCutOffSheetDetail, vPageParam);
	};

	/**
	 * 获取产品扩展信息
	 * @param product 
	 * @returns 
	 */
	getProductExtention = async (product: number) => {
		let { JkProduct } = this.uqs;
		let extention = await JkProduct.ProductExtention.obj({ product: product }); // 56998
		return extention?.content;
	};

	getCustomerOrganization = async (customer: number) => {
		let { JkCustomer } = this.uqs;
		let organization = await JkCustomer.GetCustomerOrganization.obj({ customerId: customer });
		return organization?.organization;
	}

	/**
	 * 获取contact信息
	 * @param content 
	 */
	getContant = async (contactId: number) => {
		let { JkCustomer } = this.uqs;
		return await JkCustomer.Contact.load(contactId);
	}

	/**
	 * 获取contact信息
	 * @param content 
	 */
	getProduct = async (productId: number) => {
		let { JkProduct } = this.uqs;
		return await JkProduct.ProductX.load(productId);
	}

}
