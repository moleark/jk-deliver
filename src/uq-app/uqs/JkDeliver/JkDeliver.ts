//=== UqApp builder created on Fri Oct 08 2021 18:44:54 GMT+0800 (中国标准时间) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqAction, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


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

export interface ParamCutOff {
	aWarehouse: number;
	cutOffType: number;
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

export interface ParamDelivering {
	deliver: number;
}
export interface ResultDelivering {
}

export interface ParamDelivered {
	deliver: number;
	detail: {
		deliverDetail: number;
		orderDetail: number;
		quantity: number;
	}[];

}
export interface ResultDelivered {
}

export interface ParamTallyDoneSingle {
	deliverMain: number;
	deliverDetail: number;
	quantity: number;
}
export interface ResultTallyDoneSingle {
}

export interface ParamTallyDone {
	cutOffMain: number;
}
export interface ResultTallyDone {
}

export interface ParamUpdateDeliverCarrier {
	deliverMain: number;
	carrier: number;
}
export interface ResultUpdateDeliverCarrier {
}

export interface ParamUpdateWaybillNumber {
	deliverMain: number;
	carrier: number;
	waybillNumber: string;
}
export interface ResultUpdateWaybillNumber {
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
	customer: number;
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
	customer: number;
	contact: number;
	warehouse: number;
	staff: number;
	rows: number;
	pickRows: number;
	deliverTime: any;
}
export interface ReturnGetDeliverDetail {
	id: number;
	orderDetail: number;
	delivermain: number;
	item: number;
	product: number;
	deliverShould: number;
	pickDone: number;
	returnDone: number;
}
export interface ResultGetDeliver {
	main: ReturnGetDeliverMain[];
	detail: ReturnGetDeliverDetail[];
}

export interface ParamGetReadyCutOffList {
	warehouse: number;
	cutOffType: number;
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
export interface ReturnGetCutOffMainList$page {
	id: number;
	no: string;
	cutter: number;
}
export interface ResultGetCutOffMainList {
	$page: ReturnGetCutOffMainList$page[];
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
	deliverMain: number;
	trayNumber: number;
	contact: number;
	customer: number;
	carrier: number;
	waybillNumber: string;
	deliverTime: any;
	deliverDetail: number;
	item: number;
	product: number;
	tallyShould: number;
	tallyDone: number;
	tallyState: number;
	price: number;
	orderMainNo: string;
	lotNumber: string;
	showPrice: number;
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

export interface ParamGetPointExchangeDetailTransportation {
	pointExchangeDetail: number;
}
export interface ReturnGetPointExchangeDetailTransportationRet {
	pointExchangeDetail: number;
	carrier: number;
	waybillNumber: string;
	deliverTime: any;
}
export interface ResultGetPointExchangeDetailTransportation {
	ret: ReturnGetPointExchangeDetailTransportationRet[];
}

export interface ParamGetCarrierNo {
}
export interface ReturnGetCarrierNoRet {
	id: number;
	name: string;
	no: string;
}
export interface ResultGetCarrierNo {
	ret: ReturnGetCarrierNoRet[];
}

export interface OrderMain {
	id?: number;
	no?: string;
	customerAccount: number;
	contact: number;
	currency: number;
}

export interface OrderDetail {
	id?: number;
	main?: number;
	item: number;
	product: number;
	quantity: number;
	amount: number;
	price: number;
	lotNumber: string;
}

export interface Warehouse {
	id?: number;
	name: string;
}

export interface DeliverMain {
	id?: number;
	no?: string;
	customer: number;
	contact: number;
	warehouse: number;
	cutOffMain: number;
	trayNumber: number;
	$create?: any;
}

export interface DeliverDetail {
	id?: number;
	main?: number;
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

export interface DxDeliverMain {
	id: number;
	rows?: number;
	pickRows?: number;
	carrier?: number;
	waybillNumber?: string;
	deliverTime?: any;
	staff?: number;
	startTime?: any;
	finishTime?: any;
	$act?: number;
}

export interface DxDeliverDetail {
	id: number;
	deliverDone?: number;
	pickDone?: number;
	tallyDone?: number;
	tallyState?: number;
	deliverReturn?: number;
	returnDone?: number;
	showPrice?: number;
	json?: string;
	$act?: number;
}

export interface DxCutOffMain {
	id: number;
	staff?: number;
	startTime?: any;
	finishTime?: any;
	$act?: number;
}

export interface DxDelivering {
	id: number;
	$act?: number;
}

export interface Talling {
	id: number;
	$act?: number;
}

export interface ActParamDxDeliverMain {
	id: number|IDXValue;
	rows?: number|IDXValue;
	pickRows?: number|IDXValue;
	carrier?: number|IDXValue;
	waybillNumber?: string|IDXValue;
	deliverTime?: any|IDXValue;
	staff?: number|IDXValue;
	startTime?: any|IDXValue;
	finishTime?: any|IDXValue;
	$act?: number;
}

export interface ActParamDxDeliverDetail {
	id: number|IDXValue;
	deliverDone?: number|IDXValue;
	pickDone?: number|IDXValue;
	tallyDone?: number|IDXValue;
	tallyState?: number|IDXValue;
	deliverReturn?: number|IDXValue;
	returnDone?: number|IDXValue;
	showPrice?: number|IDXValue;
	json?: string|IDXValue;
	$act?: number;
}

export interface ActParamDxCutOffMain {
	id: number|IDXValue;
	staff?: number|IDXValue;
	startTime?: any|IDXValue;
	finishTime?: any|IDXValue;
	$act?: number;
}

export interface ActParamDxDelivering {
	id: number|IDXValue;
	$act?: number;
}

export interface ActParamTalling {
	id: number|IDXValue;
	$act?: number;
}

export interface IxPendingDeliver {
	ixx: number;
	ix: number;
	xi: number;
	quantity: number;
	showPrice: number;
	json: string;
}

export interface IxUserWarehouse {
	ix: number;
	xi: number;
}

export interface IxCutoffTypeDefinition {
	ixx: number;
	ix: number;
	xi: number;
}

export interface CutOffProcessing {
	ixx: number;
	ix: number;
	xi: number;
}

export interface DeliverDetailExchangeDetail {
	ix: number;
	xi: number;
}

export interface DeliverDetailOrderDetail {
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
	dxDeliverMain?: ActParamDxDeliverMain[];
	dxDeliverDetail?: ActParamDxDeliverDetail[];
	dxCutOffMain?: ActParamDxCutOffMain[];
	dxDelivering?: ActParamDxDelivering[];
	talling?: ActParamTalling[];
	ixPendingDeliver?: IxPendingDeliver[];
	ixUserWarehouse?: IxUserWarehouse[];
	ixCutoffTypeDefinition?: IxCutoffTypeDefinition[];
	cutOffProcessing?: CutOffProcessing[];
	deliverDetailExchangeDetail?: DeliverDetailExchangeDetail[];
	deliverDetailOrderDetail?: DeliverDetailOrderDetail[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	Carrier: UqTuid<TuidCarrier>;
	DoneDeliver: UqAction<ParamDoneDeliver, ResultDoneDeliver>;
	AutoWarehouseDeliver: UqAction<ParamAutoWarehouseDeliver, ResultAutoWarehouseDeliver>;
	CutOff: UqAction<ParamCutOff, ResultCutOff>;
	Tallying: UqAction<ParamTallying, ResultTallying>;
	Delivering: UqAction<ParamDelivering, ResultDelivering>;
	Delivered: UqAction<ParamDelivered, ResultDelivered>;
	TallyDoneSingle: UqAction<ParamTallyDoneSingle, ResultTallyDoneSingle>;
	TallyDone: UqAction<ParamTallyDone, ResultTallyDone>;
	UpdateDeliverCarrier: UqAction<ParamUpdateDeliverCarrier, ResultUpdateDeliverCarrier>;
	UpdateWaybillNumber: UqAction<ParamUpdateWaybillNumber, ResultUpdateWaybillNumber>;
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
	GetPointExchangeDetailTransportation: UqQuery<ParamGetPointExchangeDetailTransportation, ResultGetPointExchangeDetailTransportation>;
	GetCarrierNo: UqQuery<ParamGetCarrierNo, ResultGetCarrierNo>;
	OrderMain: UqID<any>;
	OrderDetail: UqID<any>;
	Warehouse: UqID<any>;
	DeliverMain: UqID<any>;
	DeliverDetail: UqID<any>;
	DeliverMainEx: UqID<any>;
	CutOffMain: UqID<any>;
	CutOffType: UqID<any>;
	DeliverType: UqID<any>;
	DxDeliverMain: UqIDX<any>;
	DxDeliverDetail: UqIDX<any>;
	DxCutOffMain: UqIDX<any>;
	DxDelivering: UqIDX<any>;
	Talling: UqIDX<any>;
	IxPendingDeliver: UqIX<any>;
	IxUserWarehouse: UqIX<any>;
	IxCutoffTypeDefinition: UqIX<any>;
	CutOffProcessing: UqIX<any>;
	DeliverDetailExchangeDetail: UqIX<any>;
	DeliverDetailOrderDetail: UqIX<any>;
}

export function assign(uq: any, to:string, from:any): void {
	Object.assign((uq as any)[to], from);
}
