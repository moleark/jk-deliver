//=== UqApp builder created on Tue Jun 08 2021 22:42:29 GMT-0400 (GMT-04:00) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqAction, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ 百灵威系统工程部/deliver ========
//===============================

export interface Tuid$user {
	name: string;
	nick: string;
	icon: string;
	assigned: string;
	poke: number;
}

export interface Tuid$sheet {
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
	customer: number;
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
	deliver: number;
	deliverDone: number;
	returnDone: number;
	$id: number;
}
export interface ResultCustomerPendingDeliver {
	ret: ReturnCustomerPendingDeliverRet[];
}

export interface $PiecewiseDetail {
	id?: number;
	main?: number;
	row?: number;
	sec: number;
	value: number;
}

export interface OrderMain {
	id?: number;
	no?: string;
	customer: number;
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

export interface DxOrderDetail {
	id: number;
	deliver?: number;
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

export interface ActParamDxOrderDetail {
	id: number|IDXValue;
	deliver?: number|IDXValue;
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

export interface ParamActs {
	$PiecewiseDetail?: $PiecewiseDetail[];
	orderMain?: OrderMain[];
	orderDetail?: OrderDetail[];
	$Piecewise?: $Piecewise[];
	warehouse?: Warehouse[];
	dxOrderDetail?: ActParamDxOrderDetail[];
	dxReturnDetail?: ActParamDxReturnDetail[];
	ixPendingDeliver?: IxPendingDeliver[];
	ixCustomerPendingReturn?: IxCustomerPendingReturn[];
	ixUserWarehouse?: IxUserWarehouse[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	DoneDeliver: UqAction<ParamDoneDeliver, ResultDoneDeliver>;
	$poked: UqQuery<Param$poked, Result$poked>;
	WarehousePendingDeliver: UqQuery<ParamWarehousePendingDeliver, ResultWarehousePendingDeliver>;
	CustomerPendingDeliver: UqQuery<ParamCustomerPendingDeliver, ResultCustomerPendingDeliver>;
	$PiecewiseDetail: UqID<any>;
	OrderMain: UqID<any>;
	OrderDetail: UqID<any>;
	$Piecewise: UqID<any>;
	Warehouse: UqID<any>;
	DxOrderDetail: UqIDX<any>;
	DxReturnDetail: UqIDX<any>;
	IxPendingDeliver: UqIX<any>;
	IxCustomerPendingReturn: UqIX<any>;
	IxUserWarehouse: UqIX<any>;
}
