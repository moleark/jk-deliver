import { QueryPager } from "tonva-react";
import { makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { ReturnGetReadyCutOffCountRet, ReturnWarehouseCutOffMainRet, ReturnWarehouseDeliverMainRet } from "uq-app/uqs/JkDeliver";
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
import { VBarcode } from "./VBarcode";

export class WarehousePending {
	warehouse: number;
	readyCutOffs: ReturnGetReadyCutOffCountRet[];
	cutOffMains: ReturnWarehouseCutOffMainRet[];
	pickups: ReturnWarehousePickupsRet[];
	deliverMains: ReturnWarehouseDeliverMainRet[];

	constructor() {
		makeObservable(this, {
			readyCutOffs: observable.shallow,
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
	warehousePending: WarehousePending[];
	// barcodeString: string = '';
	genreInput: HTMLInputElement;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			warehousePending: observable.shallow,
			genreInput: observable
		});
	}
	protected async internalStart() {
	}

	tab = () => this.renderView(VHome);

	load = async () => {
		let { JkDeliver, JkWarehouse } = this.uqs;
		let [readyCutOffs, cutOffMains, pickups, deliverMains] = await Promise.all([
			JkDeliver.GetReadyCutOffCount.query({}),
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
				wp.readyCutOffs = [];
				wp.cutOffMains = [];
				wp.pickups = [];
				wp.deliverMains = [];
				arr.push(wp);
			}
			return wp;
		}
		for (let row of readyCutOffs.ret) {
			let { warehouse, readyCutOffCount } = row;
			let wp = wpFromWarehouse(warehouse);
			if (readyCutOffCount > 0) {
				wp.readyCutOffs.push(row);
			}
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

	/**
	 * 打开截单界面
	 * @param warehouse 库房
	 */
	onOpenCutOffPage = async (warehouse: number) => {
		let { JkDeliver } = this.uqs;
		let cutOffTypeRet = await JkDeliver.GetCutOffTypeList.query({})
		let { list } = cutOffTypeRet;
		let promises: PromiseLike<any>[] = [];
		list.forEach((element: any) => {
			promises.push(this.getCutOffTypeReadyCount(warehouse, element.cutOffType).then(data => element.readyCutOffCount = data));
		});
		await Promise.all(promises);

		let vPageParam = { warehouse: warehouse, cutOffTypeList: cutOffTypeRet.list };
		this.openVPage(VReadyCutOffSheet, vPageParam);
	}

	/**
	 * 查询待截单任务根据库房和截单类型
	 * @param warehouse 
	 * @param cutOffType 
	 */
	onLoadReadyCutOffList = async (warehouse: number, cutOffType: number) => {
		let { JkDeliver } = this.uqs;
		// let readyCutOffRet = await JkDeliver.GetReadyCutOffList.query({ warehouse, cutOffType });
		let readyCutOffRet: QueryPager<any> = new QueryPager<any>(JkDeliver.GetReadyCutOffList, 10, 20);
		await readyCutOffRet.first({ warehouse, cutOffType });
		return readyCutOffRet;
		// this.readyCutOffTaskList = readyCutOffRet;
	}

	/**
	 * 打开截单历史界面
	 * @param warehouse 库房
	 */
	onOpenCutOffHistory = async (warehouse: number) => {
		let { JkDeliver } = this.uqs;
		let cutOffMainLists: QueryPager<any> = new QueryPager<any>(JkDeliver.GetCutOffMainList, 10, 20);
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
	 * 选择部分产品截单
	 * @param warehouse 
	 * @param cutOffType 
	 * @param detail 
	 * @returns 
	 */
	onCutOffPart = async (warehouse: number, cutOffType: number, detail: any) => {
		let { JkDeliver } = this.uqs;
		let ret = await JkDeliver.CutOffByRequestDetail.submit({ aWarehouse: warehouse, cutOffType: cutOffType, detail: detail });
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
	 * 查询理货单
	 * @param cutOffMain 
	 * @returns 
	 */
	onGetCutOffMain = async (cutOffMain: number) => {
		let { JkDeliver } = this.uqs;
		let ret = await JkDeliver.GetCutOffMain.query({ cutOffMain });
		let { detail } = ret;
		return detail;
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
		let promises: PromiseLike<any>[] = [];
		detail.forEach((element: any) => {
			promises.push(this.getShelfBlock(element.shelfBlock).then(data => element.shelfBlockName = data));
		});
		await Promise.all(promises);

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
			promises.push(this.cApp.cDeliver.getContant(element.contact).then(data => element.contactDetail = data));
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
			pickupDetail: number;
			biz: number;
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
			deliverDone: number;
		}[]) {
		await this.uqs.JkDeliver.Delivered.submit({
			deliver,
			detail: detail.map(v => ({ deliverDetail: v.id, orderDetail: v.orderDetail, quantity: v.deliverDone }))
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

	/**
	 * 获取货位信息
	 * @param shelfBlockId 
	 * @returns 
	 */
	getShelfBlock = async (shelfBlockId: number) => {
		let { JkWarehouse } = this.uqs;
		let shelfBlock = await JkWarehouse.ShelfBlock.load(shelfBlockId);
		return shelfBlock?.name;
	}

	/**
	 * 通过产品编号查询产品包装id
	 * @param origin 
	 * @returns 
	 */
	searchProductPackByOrigin = async (origin: string) => {
		let { JkProduct } = this.uqs;
		let result: any = await JkProduct.GetProductPackByOrigin.query({ origin: origin, salesRegion: 1 });
		return result.ret;
	}

	/**
	 * 获取截单类型待结单数量
	 * @param warehouse 
	 * @param cutofftypeId 
	 * @returns 
	 */
	getCutOffTypeReadyCount = async (warehouse: number, cutofftypeId: number) => {
		let { JkDeliver } = this.uqs;
		let readyCutOffCount: number = 0;
		let result = await JkDeliver.GetCutOffTypeCount.query({ warehouseId: warehouse, cutofftypeId: cutofftypeId });
		if (result.ret[0] !== undefined) {
			readyCutOffCount = result.ret[0].readyCutOffCount;
		}
		return readyCutOffCount;
	}

	/**
	 * 通过lot查询产品编号
	 * @param lot 
	 * @returns 
	 */
	getProductNoByLot = async (lot: string) => {
		let { JkWarehouse } = this.uqs;
		let result = await JkWarehouse.SearchProductByLot.query({ lotNumber: lot });
		return result.list;
	}

	/**
	 * 打开二维码扫描界面
	 */
	openBarcodePage = () => {
		this.openVPage(VBarcode);
	}

	/**
	 * 识别转换产品编号
	 * @param code 
	 */
	async convertProductNumber(code: string) {
		let result: string = '';

		let jk_Reg = /^\w*\s\w*\sJkchemical\s1\b/;
		let fluorochem_Reg = /\bP:\d*-\d*-\d*:\w*:\w*\b/;
		let alfa_Reg = /\b1P\d*\.\d\s*\w*\b/;
		let acros_Reg = /\b1P\d*\s*\w*\b/;
		let strem_Reg = /\w*.\d.\w*\b/;
		let lot_Reg = /^\d+$/;  // 纯数字，匹配lot
		let product_Reg = /^\w\.+$/;  // 字母 符号 加数字，匹配产品编号

		let jk_res = jk_Reg.exec(code);
		if (jk_res !== null && jk_res !== undefined) {
			result = jk_res[0].split(/\s/)[0];
		}
		if (result === '') {
			let fluorochem_res = fluorochem_Reg.exec(code);
			if (fluorochem_res !== null) {
				result = fluorochem_res[0].split(/:/)[3].substring(2, 8);
			}
		}
		if (result === '') {
			let alfa_res = alfa_Reg.exec(code);
			if (alfa_res !== null) {
				result = alfa_res[0].split('.')[0].substring(2);
			}
		}
		if (result === '') {
			let acros_res = acros_Reg.exec(code);
			if (acros_res !== null) {
				result = acros_res[0].split('1T')[0].substring(2);
			}
		}
		if (result === '') {
			let strem_res = strem_Reg.exec(code);
			if (strem_res !== null) {
				result = strem_res[0];
			}
		}
		if (result === '') {
			let lot_res = lot_Reg.exec(code);
			if (lot_res !== null) {
				let productNo: any = await this.getProductNoByLot(lot_res[0]);
				if (productNo.length > 0) {
					result = productNo.product;
				} else {
					result = '';
				}
			}
		}
		if (result === '') {
			let product_res = product_Reg.exec(code);
			if (product_res !== null) {
				result = product_res[0];
			}
		}
		this.genreInput.value = result;
	}
}