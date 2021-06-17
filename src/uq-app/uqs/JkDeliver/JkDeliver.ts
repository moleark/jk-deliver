//=== UqApp builder created on Wed Jun 16 2021 20:01:25 GMT-0400 (GMT-04:00) ===//
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

export interface ParamPick {
	warehouse: number;
	pickupMaxRows: number;
}
export interface ReturnPickPickups {
	id: number;
	no: string;
}
export interface ReturnPickDelivers {
	id: number;
	no: string;
}
export interface ResultPick {
	pickups: ReturnPickPickups[];
	delivers: ReturnPickDelivers[];
}

export interface ParamDonePickupDeliver {
	pickup: number;
}
export interface ResultDonePickupDeliver {
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
	deliver: number;
	deliverDone: number;
	returnDone: number;
}
export interface ResultCustomerPendingDeliver {
	ret: ReturnCustomerPendingDeliverRet[];
}

export interface ParamWarehousePickups {
}
export interface ReturnWarehousePickupsRet {
	warehouse: number;
	pickup: number;
	no: string;
	create: any;
	picker: number;
}
export interface ResultWarehousePickups {
	ret: ReturnWarehousePickupsRet[];
}

export interface ParamWarehouseDeliverMain {
}
export interface ReturnWarehouseDeliverMainRet {
	warehouse: number;
	deliverMan: number;
	no: string;
	customer: number;
	create: any;
	picked: number;
	$id: number;
}
export interface ResultWarehouseDeliverMain {
	ret: ReturnWarehouseDeliverMainRet[];
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

export interface PickupDetail {
	id?: number;
	main?: number;
}

export interface Pickup {
	id?: number;
	no?: string;
	warehouse: number;
	picker: number;
	startTime: any;
	finishTime: any;
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

export interface OrderDetailX {
	id: number;
	needInsuredWhenDelivery?: number;
	$act?: number;
}

export interface DxPicking {
	id: number;
	$act?: number;
}

export interface DxDeliver {
	id: number;
	staff?: number;
	picked?: number;
	deliverTime?: any;
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

export interface ActParamOrderDetailX {
	id: number|IDXValue;
	needInsuredWhenDelivery?: number|IDXValue;
	$act?: number;
}

export interface ActParamDxPicking {
	id: number|IDXValue;
	$act?: number;
}

export interface ActParamDxDeliver {
	id: number|IDXValue;
	staff?: number|IDXValue;
	picked?: number|IDXValue;
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

export interface IxWarehoueDeliverMain {
	ix: number;
	xi: number;
}

export interface ParamActs {
	$PiecewiseDetail?: $PiecewiseDetail[];
	orderMain?: OrderMain[];
	orderDetail?: OrderDetail[];
	$Piecewise?: $Piecewise[];
	warehouse?: Warehouse[];
	pickupDetail?: PickupDetail[];
	pickup?: Pickup[];
	deliverMain?: DeliverMain[];
	deliverDetail?: DeliverDetail[];
	dxOrderDetail?: ActParamDxOrderDetail[];
	dxReturnDetail?: ActParamDxReturnDetail[];
	orderDetailX?: ActParamOrderDetailX[];
	dxPicking?: ActParamDxPicking[];
	dxDeliver?: ActParamDxDeliver[];
	ixPendingDeliver?: IxPendingDeliver[];
	ixCustomerPendingReturn?: IxCustomerPendingReturn[];
	ixUserWarehouse?: IxUserWarehouse[];
	ixWarehoueDeliverMain?: IxWarehoueDeliverMain[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	DoneDeliver: UqAction<ParamDoneDeliver, ResultDoneDeliver>;
	Pick: UqAction<ParamPick, ResultPick>;
	DonePickupDeliver: UqAction<ParamDonePickupDeliver, ResultDonePickupDeliver>;
	$poked: UqQuery<Param$poked, Result$poked>;
	WarehousePendingDeliver: UqQuery<ParamWarehousePendingDeliver, ResultWarehousePendingDeliver>;
	CustomerPendingDeliver: UqQuery<ParamCustomerPendingDeliver, ResultCustomerPendingDeliver>;
	WarehousePickups: UqQuery<ParamWarehousePickups, ResultWarehousePickups>;
	WarehouseDeliverMain: UqQuery<ParamWarehouseDeliverMain, ResultWarehouseDeliverMain>;
	$PiecewiseDetail: UqID<any>;
	OrderMain: UqID<any>;
	OrderDetail: UqID<any>;
	$Piecewise: UqID<any>;
	Warehouse: UqID<any>;
	PickupDetail: UqID<any>;
	Pickup: UqID<any>;
	DeliverMain: UqID<any>;
	DeliverDetail: UqID<any>;
	DxOrderDetail: UqIDX<any>;
	DxReturnDetail: UqIDX<any>;
	OrderDetailX: UqIDX<any>;
	DxPicking: UqIDX<any>;
	DxDeliver: UqIDX<any>;
	IxPendingDeliver: UqIX<any>;
	IxCustomerPendingReturn: UqIX<any>;
	IxUserWarehouse: UqIX<any>;
	IxWarehoueDeliverMain: UqIX<any>;
}
