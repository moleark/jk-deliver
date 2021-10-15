import { CApp, CUqBase } from "uq-app";
import { VDeliver } from "./VDeliver";
import { VCustomerDeliver } from "./VCustomerDeliver";
import { makeObservable, observable } from "mobx";
import { VCutOffSheetDetail } from "./VCutOffSheetDetail";
import { VCutOffHistory } from "./VCutOffHistory";
import { VReceiptList } from "./VReceiptList";
import { VSFExpressSheet } from "./VSFExpressSheet";
import { VZJSExpressSheet } from "./VZJSExpressSheet";

export class CDeliver extends CUqBase {
	// warehousePendingDeliver: ReturnWarehousePendingDeliverRet[];
	warehouse: number;
	customer: number;
	// customerOrderDetails: CustomerPendingDeliver[];
	carrierList: any[];

	constructor(cApp: CApp) {
		super(cApp);
	}

	protected async internalStart() {
	}

	tab = () => this.renderView(VDeliver);

	load = async () => {
	}

	/**
	 * ?
	 * @param row 
	loadCustomerPendingDeliver = async (row: ReturnWarehousePendingDeliverRet) => {
		let { warehouse } = row;
		let customer = 0;
		let ret = await this.uqs.JkDeliver.CustomerPendingDeliver.query({ warehouse, customer });
		this.warehouse = warehouse;
		this.customerOrderDetails = ret.ret as CustomerPendingDeliver[];
		this.openVPage(VCustomerDeliver);
	}
	*/

	/**
	 * ?
	 */
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

		let { JkDeliver } = this.uqs;
		let ret = await JkDeliver.GetCutOffMain.query({ cutOffMain });
		let { main, detail } = ret;
		this.carrierList = await JkDeliver.GetCarrierNo.table('');
		// let shouldExpressLogisticsArray: any[];

		let promises: PromiseLike<any>[] = [];
		main.forEach((element: any) => {
			promises.push(this.getWarehouse(element.warehouse).then(data => element.warehouseDetail = data));
		});
		detail.forEach((element: any) => {
			// promises.push(this.getCustomerOrganization(element.customerAccount).then(data => element.organization = data));
			promises.push(this.getProductExtention(375209 /*element.product*/).then(data => element.productExt = data));
			promises.push(this.getContant(88703).then(data => element.contactDetail = data));  //  element.contact
			promises.push(this.getProduct(232173 || element.product).then(data => element.productDetail = data));
		});
		await Promise.all(promises);

		let promisesAddress: PromiseLike<any>[] = [];
		// 可以在uq中写一个统一查询query，能够避免多次循环查询
		detail.forEach(async (element: any) => {
			promisesAddress.push(this.getAddressDetail(332).then(data => element.contactDetail.addressDetail = data));
		});
		await Promise.all(promisesAddress);

		let promisesArea: PromiseLike<any>[] = [];
		// 可以在uq中写一个统一查询query，能够避免多次循环查询
		detail.forEach(async (element: any) => {
			promisesArea.push(this.getProvinceName(element.contactDetail.addressDetail.province.id).then(data => element.contactDetail.provinceName = data));
			promisesArea.push(this.getCityName(element.contactDetail.addressDetail.city.id).then(data => element.contactDetail.cityName = data));
			promisesArea.push(this.getCountyName(element.contactDetail.addressDetail.county.id).then(data => element.contactDetail.countyName = data));
		});
		await Promise.all(promisesArea);

		let cutOff = main[0];
		detail.forEach((e: any) => {
			let apointCarrierId: any = 0;
			if (e.content) {
				let formatContent: string = String(e.content).replace(/\r\n/g, "").replace(/\r/g, "").replace(/\n/g, "");
				let jsonContect: any = JSON.parse(formatContent);
				let apointCarrier: any = jsonContect.shouldExpressLogistics[0];
				apointCarrierId = this.carrierList.find((e: any) => e.no === apointCarrier)?.id;
			}
			e.carrier = (e.carrier) ? e.carrier : apointCarrierId;
		});
		let vPageParam = [cutOff, detail];
		this.openVPage(VCutOffSheetDetail, vPageParam);
	};

	/**
	 * 打开回执单打印界面
	 * @param main 
	 * @param detail 
	 */
	openDeliveryReceiptList = async (main: any, detail: any) => {
		let vPageParam = [main, detail];
		this.openVPage(VReceiptList, vPageParam);
	}

	/**
	 * 打开顺丰电子面单打印界面
	 * @param main 
	 * @param detail 
	 */
	openSFExpressSheetList = async (detail: any[]) => {
		this.openVPage(VSFExpressSheet, detail);
	}

	/**
	 * 打开宅急送电子面单打印界面
	 * @param main 
	 * @param detail 
	 */
	openZJSExpressSheetList = async (detail: any[]) => {
		this.openVPage(VZJSExpressSheet, detail);
	}

	/**
	 * 修改发货单承运商
	 * @param deliverMain 发货单
	 * @param carrier 承运商
	 */
	updateDeliverCarrier = async (deliverMain: number, carrier: number) => {
		await this.uqs.JkDeliver.UpdateDeliverCarrier.submit({ deliverMain: deliverMain, carrier: carrier });
	}

	/**
	 * 修改发货单承运商和发运单号
	 * @param deliverMain 发货单
	 * @param carrier 承运商
	 * @param waybillNumber 单号
	 */
	updateWaybillNumber = async (deliverMain: number, carrier: number, waybillNumber: string) => {
		await this.uqs.JkDeliver.UpdateWaybillNumber.submit({ deliverMain: deliverMain, carrier: carrier, waybillNumber: waybillNumber });
	}

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

	/**
	 * 获取客户单位
	 * @param customer 
	 * @returns 
	 */
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
		/*let a: any = await JkCustomer.Contact.load(101);
		console.log(a);
		let b: any = await JkCustomer.Contact.loadMain(101);
		console.log(b);
		let c: any = await JkCustomer.Contact.getObj(101);
		console.log(c);
		let d: any = await JkCustomer.Contact.all();
		console.log(d);*/
		return await JkCustomer.Contact.load(contactId);
	}

	/**
	 * 获取产品信息（只需要获取基本产品信息，不需要包装层面）
	 * @param content 
	 */
	getProduct = async (productId: number) => {
		let { JkProduct } = this.uqs;
		return await JkProduct.ProductX.load(productId);
	}

	/**
	 * 获取库房信息
	 * @param warehouse 
	 * @returns 
	 */
	getWarehouse = async (warehouse: number) => {
		let { JkWarehouse } = this.uqs;
		return await JkWarehouse.Warehouse.load(warehouse);
	}

	/**
	 * 获取address信息
	 * @param address addressID
	 * @returns 
	 */
	getAddressDetail = async (address: number) => {
		let { JkCommon } = this.uqs;
		let addressDetail = await JkCommon.Address.load(address);
		return addressDetail;
	};
	/**
	 * 获取省份中文名称
	 * @param province provinceID
	 */
	getProvinceName = async (province: number) => {
		let { JkCommon } = this.uqs;
		let provinceDetail: any = await JkCommon.Province.load(province);
		return provinceDetail?.chineseName;
	};
	/**
	 * 获取城市中文名称
	 * @param city cityID
	 */
	getCityName = async (city: number) => {
		let { JkCommon } = this.uqs;
		let cityDetail: any = await JkCommon.City.load(city);
		return cityDetail?.chineseName;
	};
	/**
	 * 获取区县中文名称
	 * @param county countyID
	 */
	getCountyName = async (county: number) => {
		let { JkCommon } = this.uqs;
		let countyDetail: any = await JkCommon.County.load(county);
		return countyDetail?.chineseName;
	};
}
