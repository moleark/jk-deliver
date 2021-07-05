//=== UqApp builder created on Sat Jul 03 2021 15:05:11 GMT-0400 (北美东部夏令时间) ===//
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

export interface ParamDoneDeliver {
	warehouse: number;
	customer: number;
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

export interface ParamPiling {
	deliver: number;
}
export interface ResultPiling {
}

export interface ParamDonePileup {
	deliver: number;
	detail: {
		id: number;
		quantity: number;
	}[];

}
export interface ResultDonePileup {
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
	$id: number;
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
	customer: number;
	create: any;
	rows: number;
	pickRows: number;
	staff: number;
	$id: number;
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
	warehouse: number;
	staff: number;
	rows: number;
	pickRows: number;
	deliverTime: any;
}
export interface ReturnGetDeliverDetail {
	id: number;
	main: number;
	item: number;
	product: number;
	deliverShould: number;
	pickDone: number;
	deliverDone: number;
	returnDone: number;
}
export interface ResultGetDeliver {
	main: ReturnGetDeliverMain[];
	detail: ReturnGetDeliverDetail[];
}

export interface $PiecewiseDetail {
	id?: number;
	main?: number;
	sec: number;
	value: number;
}

export interface OrderMain {
	id?: number;
	no?: string;
	customer: number;
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
}

export interface $Piecewise {
	id?: number;
	name: string;
	ratio: number;
	offset: number;
	asc: number;
}

export interface Warehouse {
	id?: number;
	name: string;
}

export interface DeliverMain {
	id?: number;
	no?: string;
	customer: number;
	warehouse: number;
}

export interface DeliverDetail {
	id?: number;
	main?: number;
}

export interface DxOrderDetail {
	id: number;
	deliverShould?: number;
	pickDone?: number;
	deliverDone?: number;
	returnDone?: number;
	$act?: number;
}

export interface DxReturnDetail {
	id: number;
	orderDetail?: number;
	quantity?: number;
	quantityDone?: number;
	$act?: number;
}

export interface OrderDetailX {
	id: number;
	needInsuredWhenDelivery?: number;
	$act?: number;
}

export interface DxDeliver {
	id: number;
	staff?: number;
	rows?: number;
	pickRows?: number;
	deliverTime?: any;
	$act?: number;
}

export interface ActParamDxOrderDetail {
	id: number|IDXValue;
	deliverShould?: number|IDXValue;
	pickDone?: number|IDXValue;
	deliverDone?: number|IDXValue;
	returnDone?: number|IDXValue;
	$act?: number;
}

export interface ActParamDxReturnDetail {
	id: number|IDXValue;
	orderDetail?: number|IDXValue;
	quantity?: number|IDXValue;
	quantityDone?: number|IDXValue;
	$act?: number;
}

export interface ActParamOrderDetailX {
	id: number|IDXValue;
	needInsuredWhenDelivery?: number|IDXValue;
	$act?: number;
}

export interface ActParamDxDeliver {
	id: number|IDXValue;
	staff?: number|IDXValue;
	rows?: number|IDXValue;
	pickRows?: number|IDXValue;
	deliverTime?: any|IDXValue;
	$act?: number;
}

export interface IxPendingDeliver {
	ixx: number;
	ix: number;
	xi: number;
}

export interface IxCustomerPendingReturn {
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

export interface ParamActs {
	$PiecewiseDetail?: $PiecewiseDetail[];
	orderMain?: OrderMain[];
	orderDetail?: OrderDetail[];
	$Piecewise?: $Piecewise[];
	warehouse?: Warehouse[];
	deliverMain?: DeliverMain[];
	deliverDetail?: DeliverDetail[];
	dxOrderDetail?: ActParamDxOrderDetail[];
	dxReturnDetail?: ActParamDxReturnDetail[];
	orderDetailX?: ActParamOrderDetailX[];
	dxDeliver?: ActParamDxDeliver[];
	ixPendingDeliver?: IxPendingDeliver[];
	ixCustomerPendingReturn?: IxCustomerPendingReturn[];
	ixUserWarehouse?: IxUserWarehouse[];
	ixWarehouseDeliverMain?: IxWarehouseDeliverMain[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	DoneDeliver: UqAction<ParamDoneDeliver, ResultDoneDeliver>;
	AutoWarehouseDeliver: UqAction<ParamAutoWarehouseDeliver, ResultAutoWarehouseDeliver>;
	Piling: UqAction<ParamPiling, ResultPiling>;
	DonePileup: UqAction<ParamDonePileup, ResultDonePileup>;
	$poked: UqQuery<Param$poked, Result$poked>;
	WarehousePendingDeliver: UqQuery<ParamWarehousePendingDeliver, ResultWarehousePendingDeliver>;
	CustomerPendingDeliver: UqQuery<ParamCustomerPendingDeliver, ResultCustomerPendingDeliver>;
	WarehouseDeliverMain: UqQuery<ParamWarehouseDeliverMain, ResultWarehouseDeliverMain>;
	GetDeliver: UqQuery<ParamGetDeliver, ResultGetDeliver>;
	$PiecewiseDetail: UqID<any>;
	OrderMain: UqID<any>;
	OrderDetail: UqID<any>;
	$Piecewise: UqID<any>;
	Warehouse: UqID<any>;
	DeliverMain: UqID<any>;
	DeliverDetail: UqID<any>;
	DxOrderDetail: UqIDX<any>;
	DxReturnDetail: UqIDX<any>;
	OrderDetailX: UqIDX<any>;
	DxDeliver: UqIDX<any>;
	IxPendingDeliver: UqIX<any>;
	IxCustomerPendingReturn: UqIX<any>;
	IxUserWarehouse: UqIX<any>;
	IxWarehouseDeliverMain: UqIX<any>;
}
