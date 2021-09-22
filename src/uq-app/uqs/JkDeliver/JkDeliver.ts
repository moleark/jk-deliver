//=== UqApp builder created on Sat Sep 18 2021 13:17:08 GMT+0800 (中国标准时间) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqAction, UqQuery, UqMap, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ 百灵威系统工程部/deliver ========
//===============================

export interface Tuid$user {
	id?: number;
	name: string;
	nick: string;
	icon: string;
	assigned: string;
	poke: number;
}

export interface Tuid$sheet {
	id?: number;
	no: string;
	user: number;
	date: any;
	sheet: number;
	version: number;
	flow: number;
	app: number;
	state: number;
	discription: string;
	data: string;
	processing: number;
}

export interface TuidCarrier {
	id?: number;
	name: string;
	no: string;
	isValid: number;
}

export interface TuidCustomer {
	id?: number;
	name: string;
}

export interface TuidAddress {
	id?: number;
	country: number;
	province: number;
	city: number;
	county: number;
	description: string;
}

export interface TuidContact {
	id?: number;
	name: string;
	organizationName: string;
	mobile: string;
	telephone: string;
	email: string;
	address: number;
	addressString: string;
}

export interface TuidCity {
	id?: number;
	province: number;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidCounty {
	id?: number;
	city: number;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidCountry {
	id?: number;
	code: string;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidBrand {
	id?: number;
	name: string;
	no: string;
}

export interface TuidProvince {
	id?: number;
	country: number;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidOrganization {
	id?: number;
	name: string;
}

export interface TuidProductX {
	id?: number;
	brand: number;
	origin: string;
	description: string;
	descriptionC: string;
}

export interface ParamDoneDeliver {
	customer: number;
	contact: number;
	warehouse: number;
	detail: {
		orderDetail: number;
		quantity: number;
	}[];

}
export interface ResultDoneDeliver {
}

export interface ParamAutoWarehouseDeliver {
}
export interface ResultAutoWarehouseDeliver {
}

export interface ParamPicking {
	deliver: number;
}
export interface ResultPicking {
}

export interface ParamDonePickup {
	deliver: number;
	detail: {
		id: number;
		quantity: number;
	}[];

}
export interface ResultDonePickup {
}

export interface ParamCutOff {
	cutWarehouse: number;
}
export interface ReturnCutOffMain {
	id: number;
	no: string;
}
export interface ResultCutOff {
	main: ReturnCutOffMain[];
}

export interface ParamTallying {
	cutOffMain: number;
}
export interface ResultTallying {
}

export interface ParamTallied {
	cutOffMain: number;
	detail: {
		orderDetail: number;
		quantity: number;
	}[];

}
export interface ResultTallied {
}

export interface Param$poked {
}
export interface Return$pokedRet {
	poke: number;
}
export interface Result$poked {
	ret: Return$pokedRet[];
}

export interface ParamWarehousePendingDeliver {
}
export interface ReturnWarehousePendingDeliverRet {
	warehouse: number;
	rowCount: number;
}
export interface ResultWarehousePendingDeliver {
	ret: ReturnWarehousePendingDeliverRet[];
}

export interface ParamCustomerPendingDeliver {
	warehouse: number;
	customer: number;
}
export interface ReturnCustomerPendingDeliverRet {
	orderDetail: number;
	item: number;
	product: number;
	quantity: number;
	amount: number;
	price: number;
	deliverShould: number;
	deliverDone: number;
	returnDone: number;
}
export interface ResultCustomerPendingDeliver {
	ret: ReturnCustomerPendingDeliverRet[];
}

export interface ParamWarehouseDeliverMain {
}
export interface ReturnWarehouseDeliverMainRet {
	warehouse: number;
	deliverMain: number;
	no: string;
	customerAccount: number;
	create: any;
	rows: number;
	pickRows: number;
	staff: number;
}
export interface ResultWarehouseDeliverMain {
	ret: ReturnWarehouseDeliverMainRet[];
}

export interface ParamGetDeliver {
	deliver: number;
}
export interface ReturnGetDeliverMain {
	id: number;
	no: string;
	customerAccount: number;
	organizationname: string;
	contact: number;
	warehouse: number;
	staff: number;
	rows: number;
	pickRows: number;
	contactName: string;
	contactOrganization: string;
	mobile: string;
	telephone: string;
	email: string;
	addressstring: string;
	province: string;
	city: string;
	county: string;
	carrier: number;
	waybillNumber: string;
	deliverTime: any;
}
export interface ReturnGetDeliverDetail {
	id: number;
	delivermain: number;
	item: number;
	radiox: number;
	radioy: number;
	unit: string;
	product: number;
	origin: string;
	descriptionc: string;
	description: string;
	deliverShould: number;
	pickDone: number;
	deliverDone: number;
	returnDone: number;
}
export interface ResultGetDeliver {
	main: ReturnGetDeliverMain[];
	detail: ReturnGetDeliverDetail[];
}

export interface ParamGetReadyCutOffList {
	warehouse: number;
}
export interface ReturnGetReadyCutOffListList {
	orderDetail: number;
	product: number;
	item: number;
	shouldQuantity: number;
	customerAccount: number;
}
export interface ResultGetReadyCutOffList {
	list: ReturnGetReadyCutOffListList[];
}

export interface ParamGetCutOffMainList {
	warehouse: number;
}
export interface ReturnGetCutOffMainListList {
	id: number;
	no: string;
	cutter: number;
}
export interface ResultGetCutOffMainList {
	list: ReturnGetCutOffMainListList[];
}

export interface ParamWarehouseCutOffMain {
}
export interface ReturnWarehouseCutOffMainRet {
	warehouse: number;
	cutOffMain: number;
	no: string;
	cutter: number;
	create: any;
	staff: number;
}
export interface ResultWarehouseCutOffMain {
	ret: ReturnWarehouseCutOffMainRet[];
}

export interface ParamGetCutOffMain {
	cutOffMain: number;
}
export interface ReturnGetCutOffMainMain {
	id: number;
	no: string;
	warehouse: number;
	cutter: number;
	staff: number;
}
export interface ReturnGetCutOffMainDetail {
	delivermain: number;
	trayNumber: number;
	contact: number;
	customerAccount: number;
	carrier: number;
	waybillNumber: string;
	deliverTime: any;
	deliverDetail: number;
	item: number;
	product: number;
	tallyShould: number;
	price: number;
	lotNumber: string;
	content: string;
}
export interface ResultGetCutOffMain {
	main: ReturnGetCutOffMainMain[];
	detail: ReturnGetCutOffMainDetail[];
}

export interface ParamGetOrderDetailTransportation {
	orderDetail: number;
}
export interface ReturnGetOrderDetailTransportationRet {
	orderDetail: number;
	carrier: number;
	waybillNumber: string;
	deliverTime: any;
}
export interface ResultGetOrderDetailTransportation {
	ret: ReturnGetOrderDetailTransportationRet[];
}

export interface OrderMain {
	id?: number;
	no?: string;
	customerAccount: number;
	contact: number;
}

export interface OrderDetail {
	id?: number;
	main?: number;
	item: number;
	product: number;
	quantity: number;
	amount: number;
	price: number;
	warehouse: number;
	lotNumber: string;
}

export interface Warehouse {
	id?: number;
	name: string;
}

export interface DeliverMain {
	id?: number;
	no?: string;
	customerAccount: number;
	contact: number;
	warehouse: number;
	cutOffMain: number;
	trayNumber: number;
	$create?: any;
}

export interface DeliverDetail {
	id?: number;
	main?: number;
	orderDetail: number;
	quantity: number;
}

export interface DeliverMainEx {
	id?: number;
	deliverId: string;
	warehouseName: string;
	addressString: string;
}

export interface CutOffMain {
	id?: number;
	no?: string;
	warehouse: number;
	cutter: number;
	$create?: any;
}

export interface CutOffType {
	id?: number;
	name: string;
	description: string;
	$create?: any;
}

export interface DeliverType {
	id?: number;
	name: string;
	description: string;
}

export interface DxOrderDetail {
	id: number;
	deliverShould?: number;
	deliverReturn?: number;
	returnDone?: number;
	pickDone?: number;
	deliverDone?: number;
	$act?: number;
}

export interface DxReturnDetail {
	id: number;
	quantityDone?: number;
	$act?: number;
}

export interface OrderDetailX {
	id: number;
	needInsuredWhenDelivery?: number;
	showPrice?: number;
	lotNumber?: string;
	json?: string;
	$act?: number;
}

export interface DxDeliverMain {
	id: number;
	staff?: number;
	rows?: number;
	pickRows?: number;
	carrier?: number;
	waybillNumber?: string;
	deliverTime?: any;
	$act?: number;
}

export interface DxDeliverDetail {
	id: number;
	deliverDone?: number;
	$act?: number;
}

export interface DxCutOffMain {
	id: number;
	staff?: number;
	startTime?: any;
	finishTime?: any;
	$act?: number;
}

export interface ActParamDxOrderDetail {
	id: number|IDXValue;
	deliverShould?: number|IDXValue;
	deliverReturn?: number|IDXValue;
	returnDone?: number|IDXValue;
	pickDone?: number|IDXValue;
	deliverDone?: number|IDXValue;
	$act?: number;
}

export interface ActParamDxReturnDetail {
	id: number|IDXValue;
	quantityDone?: number|IDXValue;
	$act?: number;
}

export interface ActParamOrderDetailX {
	id: number|IDXValue;
	needInsuredWhenDelivery?: number|IDXValue;
	showPrice?: number|IDXValue;
	lotNumber?: string|IDXValue;
	json?: string|IDXValue;
	$act?: number;
}

export interface ActParamDxDeliverMain {
	id: number|IDXValue;
	staff?: number|IDXValue;
	rows?: number|IDXValue;
	pickRows?: number|IDXValue;
	carrier?: number|IDXValue;
	waybillNumber?: string|IDXValue;
	deliverTime?: any|IDXValue;
	$act?: number;
}

export interface ActParamDxDeliverDetail {
	id: number|IDXValue;
	deliverDone?: number|IDXValue;
	$act?: number;
}

export interface ActParamDxCutOffMain {
	id: number|IDXValue;
	staff?: number|IDXValue;
	startTime?: any|IDXValue;
	finishTime?: any|IDXValue;
	$act?: number;
}

export interface IxPendingDeliver {
	ixx: number;
	ix: number;
	xi: number;
}

export interface IxUserWarehouse {
	ix: number;
	xi: number;
}

export interface IxWarehouseDeliverMain {
	ix: number;
	xi: number;
}

export interface IxWarehouseCutOffMain {
	ix: number;
	xi: number;
}

export interface IxCutoffTypeDefinition {
	ixx: number;
	ix: number;
	xi: number;
}

export interface ParamActs {
	orderMain?: OrderMain[];
	orderDetail?: OrderDetail[];
	warehouse?: Warehouse[];
	deliverMain?: DeliverMain[];
	deliverDetail?: DeliverDetail[];
	deliverMainEx?: DeliverMainEx[];
	cutOffMain?: CutOffMain[];
	cutOffType?: CutOffType[];
	deliverType?: DeliverType[];
	dxOrderDetail?: ActParamDxOrderDetail[];
	dxReturnDetail?: ActParamDxReturnDetail[];
	orderDetailX?: ActParamOrderDetailX[];
	dxDeliverMain?: ActParamDxDeliverMain[];
	dxDeliverDetail?: ActParamDxDeliverDetail[];
	dxCutOffMain?: ActParamDxCutOffMain[];
	ixPendingDeliver?: IxPendingDeliver[];
	ixUserWarehouse?: IxUserWarehouse[];
	ixWarehouseDeliverMain?: IxWarehouseDeliverMain[];
	ixWarehouseCutOffMain?: IxWarehouseCutOffMain[];
	ixCutoffTypeDefinition?: IxCutoffTypeDefinition[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	Carrier: UqTuid<TuidCarrier>;
	Customer: UqTuid<TuidCustomer>;
	Address: UqTuid<TuidAddress>;
	Contact: UqTuid<TuidContact>;
	City: UqTuid<TuidCity>;
	County: UqTuid<TuidCounty>;
	Country: UqTuid<TuidCountry>;
	Brand: UqTuid<TuidBrand>;
	Province: UqTuid<TuidProvince>;
	Organization: UqTuid<TuidOrganization>;
	ProductX: UqTuid<TuidProductX>;
	DoneDeliver: UqAction<ParamDoneDeliver, ResultDoneDeliver>;
	AutoWarehouseDeliver: UqAction<ParamAutoWarehouseDeliver, ResultAutoWarehouseDeliver>;
	Picking: UqAction<ParamPicking, ResultPicking>;
	DonePickup: UqAction<ParamDonePickup, ResultDonePickup>;
	CutOff: UqAction<ParamCutOff, ResultCutOff>;
	Tallying: UqAction<ParamTallying, ResultTallying>;
	Tallied: UqAction<ParamTallied, ResultTallied>;
	$poked: UqQuery<Param$poked, Result$poked>;
	WarehousePendingDeliver: UqQuery<ParamWarehousePendingDeliver, ResultWarehousePendingDeliver>;
	CustomerPendingDeliver: UqQuery<ParamCustomerPendingDeliver, ResultCustomerPendingDeliver>;
	WarehouseDeliverMain: UqQuery<ParamWarehouseDeliverMain, ResultWarehouseDeliverMain>;
	GetDeliver: UqQuery<ParamGetDeliver, ResultGetDeliver>;
	GetReadyCutOffList: UqQuery<ParamGetReadyCutOffList, ResultGetReadyCutOffList>;
	GetCutOffMainList: UqQuery<ParamGetCutOffMainList, ResultGetCutOffMainList>;
	WarehouseCutOffMain: UqQuery<ParamWarehouseCutOffMain, ResultWarehouseCutOffMain>;
	GetCutOffMain: UqQuery<ParamGetCutOffMain, ResultGetCutOffMain>;
	GetOrderDetailTransportation: UqQuery<ParamGetOrderDetailTransportation, ResultGetOrderDetailTransportation>;
	OrganizationCustomer: UqMap;
	OrderMain: UqID<any>;
	OrderDetail: UqID<any>;
	Warehouse: UqID<any>;
	DeliverMain: UqID<any>;
	DeliverDetail: UqID<any>;
	DeliverMainEx: UqID<any>;
	CutOffMain: UqID<any>;
	CutOffType: UqID<any>;
	DeliverType: UqID<any>;
	DxOrderDetail: UqIDX<any>;
	DxReturnDetail: UqIDX<any>;
	OrderDetailX: UqIDX<any>;
	DxDeliverMain: UqIDX<any>;
	DxDeliverDetail: UqIDX<any>;
	DxCutOffMain: UqIDX<any>;
	IxPendingDeliver: UqIX<any>;
	IxUserWarehouse: UqIX<any>;
	IxWarehouseDeliverMain: UqIX<any>;
	IxWarehouseCutOffMain: UqIX<any>;
	IxCutoffTypeDefinition: UqIX<any>;
}

export function assign(uq: any, to:string, from:any): void {
	Object.assign((uq as any)[to], from);
}
