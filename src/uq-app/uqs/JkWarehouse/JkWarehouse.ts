//=== UqApp builder created on Tue Jun 29 2021 22:58:37 GMT-0400 (GMT-04:00) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqAction, UqBook, UqQuery, UqMap, UqHistory, UqPending, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ 百灵威系统工程部/warehouse ========
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

export interface TuidSalesRegion {
	name: string;
	currency: number;
	no: string;
}

export interface TuidAddress {
	country: number;
	province: number;
	city: number;
	county: number;
	description: string;
}

export interface TuidCountry {
	code: string;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidProvince {
	country: number;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidCity {
	province: number;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidCounty {
	city: number;
	englishName: string;
	chineseName: string;
	no: string;
}

export interface TuidCurrency {
	name: string;
	suffix: string;
}

export interface TuidBrand {
	name: string;
	no: string;
}

export interface TuidProductX {
	brand: number;
}

export interface TuidShippingArea {
	name: string;
}

export interface TuidWarehouse {
	name: string;
	no: string;
	code: string;
	isValid: number;
}

export interface TuidWarehouseRoom {
	name: string;
	no: string;
	code: string;
	warehouse: number;
	isValid: number;
}

export interface TuidShelfLayer {
	name: string;
	no: string;
	code: string;
	shelf: number;
	isValid: number;
}

export interface TuidShelf {
	name: string;
	no: string;
	code: string;
	warehouseRoom: number;
	isValid: number;
}

export interface TuidShelfBlock {
	name: string;
	no: string;
	code: string;
	shelfLayer: number;
}

export interface TuidStorageCondition {
	name: string;
	no: string;
}

export interface TuidWarehouseStorageCondition {
	name: string;
	description: string;
}

export interface TuidExpressLogistics {
	name: string;
	no: string;
	isValid: number;
	salesRegion: number;
}

export interface TuidOutInBoundOrder {
	warehouse: number;
	createTime: any;
	confirmTime: any;
	type: number;
	state: number;
	operator: number;
	confirmer: number;
}

export interface TuidOutInBoundReason {
	name: string;
	no: string;
	note: string;
}

export interface TuidWebUser {
}

export interface ParamOutBoundCut {
	warehouse: number;
}
export interface ReturnOutBoundCutRet {
	outBoundOrderId: number;
	$id: number;
}
export interface ResultOutBoundCut {
	ret: ReturnOutBoundCutRet[];
}

export interface ParamPick {
	warehouse: number;
	pickupMaxRows: number;
}
export interface ReturnPickPickups {
	id: number;
	no: string;
	$id: number;
}
export interface ReturnPickDelivers {
	id: number;
	no: string;
	$id: number;
}
export interface ResultPick {
	pickups: ReturnPickPickups[];
	delivers: ReturnPickDelivers[];
}

export interface ParamTrySchedule {
	p: number;
}
export interface ResultTrySchedule {
}

export interface ParamTrySchedule1 {
}
export interface ResultTrySchedule1 {
}

export interface ParamAutoPick {
}
export interface ResultAutoPick {
}

export interface ParamPicked {
	pickup: number;
	detail: {
		orderDetail: number;
		quantity: number;
	}[];

}
export interface ResultPicked {
}

export interface ParamPicking {
	pickup: number;
}
export interface ResultPicking {
}

export interface ParamGetInventoryAllocation {
	product: number;
	pack: number;
	salesRegion: number;
}
export interface ReturnGetInventoryAllocationRet {
	product: number;
	pack: number;
	salesRegion: number;
	warehouse: number;
	quantity: number;
	minDeliveryDays: number;
	maxDeliveryDays: number;
	deliveryTimeDescription: string;
	$id: number;
}
export interface ResultGetInventoryAllocation {
	ret: ReturnGetInventoryAllocationRet[];
}

export interface ParamGetShippingPlan {
	product: number;
	pack: number;
	city: number;
	quantity: number;
}
export interface ReturnGetShippingPlanRet {
	product: number;
	pack: number;
	warehouse: number;
	quantity: number;
	$id: number;
}
export interface ResultGetShippingPlan {
	ret: ReturnGetShippingPlanRet[];
}

export interface ParamSearchWarehouseByKey {
	key: string;
}
export interface ReturnSearchWarehouseByKeyRet {
	id: number;
	name: string;
	no: string;
	$id: number;
}
export interface ResultSearchWarehouseByKey {
	ret: ReturnSearchWarehouseByKeyRet[];
}

export interface ParamSearchWarehouseRoom {
	warehouse: number;
	key: string;
}
export interface ReturnSearchWarehouseRoomRet {
	id: number;
	no: string;
	name: string;
	warehouse: number;
	isValid: number;
	$id: number;
}
export interface ResultSearchWarehouseRoom {
	ret: ReturnSearchWarehouseRoomRet[];
}

export interface ParamSearchShelf {
	warehouseRoom: number;
	key: string;
}
export interface ReturnSearchShelfRet {
	id: number;
	no: string;
	name: string;
	warehouseRoom: number;
	isValid: number;
	$id: number;
}
export interface ResultSearchShelf {
	ret: ReturnSearchShelfRet[];
}

export interface ParamSearchShelfLayer {
	shelf: number;
	key: string;
}
export interface ReturnSearchShelfLayerRet {
	id: number;
	no: string;
	name: string;
	shelf: number;
	isValid: number;
	$id: number;
}
export interface ResultSearchShelfLayer {
	ret: ReturnSearchShelfLayerRet[];
}

export interface ParamSearchShelfBlock {
	shelfLayer: number;
	key: string;
}
export interface ReturnSearchShelfBlockRet {
	id: number;
	no: string;
	name: string;
	shelfLayer: number;
	$id: number;
}
export interface ResultSearchShelfBlock {
	ret: ReturnSearchShelfBlockRet[];
}

export interface Param$poked {
}
export interface Return$pokedRet {
	poke: number;
	$id: number;
}
export interface Result$poked {
	ret: Return$pokedRet[];
}

export interface ParamSearchReadyOutBoundCutTastList {
	warehouse: number;
}
export interface ReturnSearchReadyOutBoundCutTastListRet {
	consigneeUnitName: string;
	consigneeName: string;
	product: number;
	pack: number;
	quantity: number;
	outBoundTime: any;
	warehouse: number;
	outBoundReason: number;
	$id: number;
}
export interface ResultSearchReadyOutBoundCutTastList {
	ret: ReturnSearchReadyOutBoundCutTastListRet[];
}

export interface ParamSearchOutBoundOrderDetail {
	outBoundOrder: number;
}
export interface ReturnSearchOutBoundOrderDetailRet {
	warehouse: number;
	shelfBlock: number;
	product: number;
	pack: number;
	quantity: number;
	consigneeName: string;
	consigneeUnitName: string;
	consigneeAddress: string;
	consigneeZipcode: string;
	consigneeTelphone: string;
	consigneeMobile: string;
	expressLogistics: number;
	shouldExpressLogistics: string;
	shouldNotExpressLogistics: string;
	needInsuredWhenDelivery: number;
	unitPrice: number;
	currency: string;
	isNeedDelivery: number;
	deliveryData: string;
	coaQuantity: number;
	msdsQuantity: number;
	receiptQuantity: number;
	purchaseBillQuantity: number;
	showPriceWhenPrintReceipt: number;
	isAppointLot: number;
	appointLot: string;
	deliveryNotes: string;
	outBoundReason: number;
	relationId: string;
	outBoundOrder: string;
	trayNumber: number;
	handOverTime: any;
	outBoundTime: any;
	$id: number;
}
export interface ResultSearchOutBoundOrderDetail {
	ret: ReturnSearchOutBoundOrderDetailRet[];
}

export interface ParamSearchOutBoundOrderList {
	warehouse: number;
}
export interface ReturnSearchOutBoundOrderListRet {
	id: number;
	warehouse: number;
	state: number;
	operator: number;
	createTime: any;
	$id: number;
}
export interface ResultSearchOutBoundOrderList {
	ret: ReturnSearchOutBoundOrderListRet[];
}

export interface ParamGetValidWarehouseList {
}
export interface ReturnGetValidWarehouseListRet {
	id: number;
	name: string;
	no: string;
	$id: number;
}
export interface ResultGetValidWarehouseList {
	ret: ReturnGetValidWarehouseListRet[];
}

export interface ParamWarehousePickups {
}
export interface ReturnWarehousePickupsRet {
	warehouse: number;
	pickup: number;
	no: string;
	create: any;
	picker: number;
	$id: number;
}
export interface ResultWarehousePickups {
	ret: ReturnWarehousePickupsRet[];
}

export interface ParamGetPickup {
	pickup: number;
}
export interface ReturnGetPickupMain {
	id: number;
	no: string;
	warehouse: number;
	picker: number;
	startTime: any;
	finishTime: any;
	$id: number;
}
export interface ReturnGetPickupDetail {
	id: number;
	main: number;
	orderDetail: number;
	quantity: number;
	item: number;
	product: number;
	shouldQuantity: number;
	$id: number;
}
export interface ResultGetPickup {
	main: ReturnGetPickupMain[];
	detail: ReturnGetPickupDetail[];
}

export interface ParamProductInventory {
	warehouse: number;
	product: number;
}
export interface ReturnProductInventory$page {
	pack: number;
	quantity: number;
}
export interface ResultProductInventory {
	$page: ReturnProductInventory$page[];
}

export interface ParamShelfBlockInventory {
}
export interface ReturnShelfBlockInventory$page {
	shelfBlock: number;
	quantity: number;
}
export interface ResultShelfBlockInventory {
	$page: ReturnShelfBlockInventory$page[];
}

export interface ParamShelfBlockLotInventory {
	shelfBlock: number;
	product: number;
}
export interface ReturnShelfBlockLotInventory$page {
	pack: number;
	lotNumber: string;
	quantity: number;
}
export interface ResultShelfBlockLotInventory {
	$page: ReturnShelfBlockLotInventory$page[];
}

export interface ParamShelfInOutBoundHistory {
	shelfBlock: number;
	product: number;
	pack: number;
	inOutType: number;
	quantity: number;
	inOutBoundTime: any;
}
export interface ReturnShelfInOutBoundHistory$page {
	date: any;
	shelfBlock: number;
	product: number;
	pack: number;
	inOutType: number;
	quantity: number;
	inOutBoundTime: any;
}
export interface ResultShelfInOutBoundHistory {
	$page: ReturnShelfInOutBoundHistory$page[];
}

export interface ParamOutBoundCutHistory {
	warehouse: number;
	shelfBlock: number;
	product: number;
	pack: number;
	quantity: number;
	consigneeName: string;
	consigneeUnitName: string;
	consigneeAddress: string;
	consigneeZipcode: string;
	consigneeTelphone: string;
	consigneeMobile: string;
	expressLogistics: number;
	shouldExpressLogistics: string;
	shouldNotExpressLogistics: string;
	needInsuredWhenDelivery: number;
	unitPrice: number;
	currency: string;
	isNeedDelivery: number;
	deliveryData: string;
	coaQuantity: number;
	msdsQuantity: number;
	receiptQuantity: number;
	purchaseBillQuantity: number;
	showPriceWhenPrintReceipt: number;
	isAppointLot: number;
	appointLot: string;
	deliveryNotes: string;
	outBoundReason: number;
	relationId: string;
	outBoundOrder: string;
	trayNumber: number;
	handOverTime: any;
	outBoundTime: any;
}
export interface ReturnOutBoundCutHistory$page {
	date: any;
	warehouse: number;
	shelfBlock: number;
	product: number;
	pack: number;
	quantity: number;
	consigneeName: string;
	consigneeUnitName: string;
	consigneeAddress: string;
	consigneeZipcode: string;
	consigneeTelphone: string;
	consigneeMobile: string;
	expressLogistics: number;
	shouldExpressLogistics: string;
	shouldNotExpressLogistics: string;
	needInsuredWhenDelivery: number;
	unitPrice: number;
	currency: string;
	isNeedDelivery: number;
	deliveryData: string;
	coaQuantity: number;
	msdsQuantity: number;
	receiptQuantity: number;
	purchaseBillQuantity: number;
	showPriceWhenPrintReceipt: number;
	isAppointLot: number;
	appointLot: string;
	deliveryNotes: string;
	outBoundReason: number;
	relationId: string;
	outBoundOrder: string;
	trayNumber: number;
	handOverTime: any;
	outBoundTime: any;
}
export interface ResultOutBoundCutHistory {
	$page: ReturnOutBoundCutHistory$page[];
}

export interface ParamTransportTracking {
	transCompany: number;
	transnumber: string;
	station: string;
	nextStation: string;
	content: string;
	createTime: any;
}
export interface ReturnTransportTracking$page {
	date: any;
	transCompany: number;
	transnumber: string;
	station: string;
	nextStation: string;
	content: string;
	createTime: any;
}
export interface ResultTransportTracking {
	$page: ReturnTransportTracking$page[];
}

export interface $PiecewiseDetail {
	id?: number;
	main?: number;
	sec: number;
	value: number;
}

export interface $Piecewise {
	id?: number;
	name: string;
	ratio: number;
	offset: number;
	asc: number;
}

export interface StorePoint {
	id?: number;
	warehouse: number;
	room: number;
	x: number;
	y: number;
	z: number;
}

export interface Item {
	id?: number;
}

export interface Section {
	id?: number;
	parent: number;
	name: string;
	warehouse: number;
}

export interface OrderMain {
	id?: number;
	no?: string;
}

export interface Pickup {
	id?: number;
	no?: string;
	warehouse: number;
	picker: number;
	startTime: any;
	finishTime: any;
	$owner?: number;
	$create?: any;
}

export interface OrderDetail {
	id?: number;
	main?: number;
	item: number;
	product: number;
	quantity: number;
	warehouse: number;
}

export interface WarehouseN {
	id?: number;
}

export interface PickupDetail {
	id?: number;
	main?: number;
	orderDetail: number;
	quantity: number;
}

export interface ItemResearch {
	id?: number;
}

export interface ItemProductPack {
	id?: number;
	product: number;
	pack: number;
}

export interface ItemProductPackLot {
	id?: number;
	product: number;
	pack: number;
	lot: string;
}

export interface DxPicking {
	id: number;
	$act?: number;
}

export interface OrderDetailX {
	id: number;
	needInsuredWhenDelivery?: number;
	$act?: number;
}

export interface ActParamDxPicking {
	id: number|IDXValue;
	$act?: number;
}

export interface ActParamOrderDetailX {
	id: number|IDXValue;
	needInsuredWhenDelivery?: number|IDXValue;
	$act?: number;
}

export interface WarehouseSection {
	ix: number;
	xi: number;
}

export interface ItemStore {
	ixx: number;
	ix: number;
	xi: number;
	quantity: number;
}

export interface IxUserWarehouse {
	ix: number;
	xi: number;
}

export interface IxPendingPickup {
	ix: number;
	xi: number;
}

export interface ParamActs {
	$PiecewiseDetail?: $PiecewiseDetail[];
	$Piecewise?: $Piecewise[];
	storePoint?: StorePoint[];
	item?: Item[];
	section?: Section[];
	orderMain?: OrderMain[];
	pickup?: Pickup[];
	orderDetail?: OrderDetail[];
	warehouseN?: WarehouseN[];
	pickupDetail?: PickupDetail[];
	itemResearch?: ItemResearch[];
	itemProductPack?: ItemProductPack[];
	itemProductPackLot?: ItemProductPackLot[];
	dxPicking?: ActParamDxPicking[];
	orderDetailX?: ActParamOrderDetailX[];
	warehouseSection?: WarehouseSection[];
	itemStore?: ItemStore[];
	ixUserWarehouse?: IxUserWarehouse[];
	ixPendingPickup?: IxPendingPickup[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	SalesRegion: UqTuid<TuidSalesRegion>;
	Address: UqTuid<TuidAddress>;
	Country: UqTuid<TuidCountry>;
	Province: UqTuid<TuidProvince>;
	City: UqTuid<TuidCity>;
	County: UqTuid<TuidCounty>;
	Currency: UqTuid<TuidCurrency>;
	Brand: UqTuid<TuidBrand>;
	ProductX: UqTuid<TuidProductX>;
	ShippingArea: UqTuid<TuidShippingArea>;
	Warehouse: UqTuid<TuidWarehouse>;
	WarehouseRoom: UqTuid<TuidWarehouseRoom>;
	ShelfLayer: UqTuid<TuidShelfLayer>;
	Shelf: UqTuid<TuidShelf>;
	ShelfBlock: UqTuid<TuidShelfBlock>;
	StorageCondition: UqTuid<TuidStorageCondition>;
	WarehouseStorageCondition: UqTuid<TuidWarehouseStorageCondition>;
	ExpressLogistics: UqTuid<TuidExpressLogistics>;
	OutInBoundOrder: UqTuid<TuidOutInBoundOrder>;
	OutInBoundReason: UqTuid<TuidOutInBoundReason>;
	WebUser: UqTuid<TuidWebUser>;
	OutBoundCut: UqAction<ParamOutBoundCut, ResultOutBoundCut>;
	Pick: UqAction<ParamPick, ResultPick>;
	TrySchedule: UqAction<ParamTrySchedule, ResultTrySchedule>;
	TrySchedule1: UqAction<ParamTrySchedule1, ResultTrySchedule1>;
	AutoPick: UqAction<ParamAutoPick, ResultAutoPick>;
	Picked: UqAction<ParamPicked, ResultPicked>;
	Picking: UqAction<ParamPicking, ResultPicking>;
	ProductInventory: UqBook<ParamProductInventory, ResultProductInventory>;
	ShelfBlockInventory: UqBook<ParamShelfBlockInventory, ResultShelfBlockInventory>;
	ShelfBlockLotInventory: UqBook<ParamShelfBlockLotInventory, ResultShelfBlockLotInventory>;
	GetInventoryAllocation: UqQuery<ParamGetInventoryAllocation, ResultGetInventoryAllocation>;
	GetShippingPlan: UqQuery<ParamGetShippingPlan, ResultGetShippingPlan>;
	SearchWarehouseByKey: UqQuery<ParamSearchWarehouseByKey, ResultSearchWarehouseByKey>;
	SearchWarehouseRoom: UqQuery<ParamSearchWarehouseRoom, ResultSearchWarehouseRoom>;
	SearchShelf: UqQuery<ParamSearchShelf, ResultSearchShelf>;
	SearchShelfLayer: UqQuery<ParamSearchShelfLayer, ResultSearchShelfLayer>;
	SearchShelfBlock: UqQuery<ParamSearchShelfBlock, ResultSearchShelfBlock>;
	$poked: UqQuery<Param$poked, Result$poked>;
	SearchReadyOutBoundCutTastList: UqQuery<ParamSearchReadyOutBoundCutTastList, ResultSearchReadyOutBoundCutTastList>;
	SearchOutBoundOrderDetail: UqQuery<ParamSearchOutBoundOrderDetail, ResultSearchOutBoundOrderDetail>;
	SearchOutBoundOrderList: UqQuery<ParamSearchOutBoundOrderList, ResultSearchOutBoundOrderList>;
	GetValidWarehouseList: UqQuery<ParamGetValidWarehouseList, ResultGetValidWarehouseList>;
	WarehousePickups: UqQuery<ParamWarehousePickups, ResultWarehousePickups>;
	GetPickup: UqQuery<ParamGetPickup, ResultGetPickup>;
	ShippingAreaInclusionProvince: UqMap;
	ShippingAreaInclusionCity: UqMap;
	WarehouseSupportProvince: UqMap;
	WarehouseSupportCity: UqMap;
	SalesRegionWarehouse: UqMap;
	WarehouseStorageConditionMap: UqMap;
	ShelfInOutBoundHistory: UqHistory<ParamShelfInOutBoundHistory, ResultShelfInOutBoundHistory>;
	OutBoundCutHistory: UqHistory<ParamOutBoundCutHistory, ResultOutBoundCutHistory>;
	TransportTracking: UqHistory<ParamTransportTracking, ResultTransportTracking>;
	OutBoundReadyCutTask: UqPending<any, any>;
	OutBoundHandoverTask: UqPending<any, any>;
	$PiecewiseDetail: UqID<any>;
	$Piecewise: UqID<any>;
	StorePoint: UqID<any>;
	Item: UqID<any>;
	Section: UqID<any>;
	OrderMain: UqID<any>;
	Pickup: UqID<any>;
	OrderDetail: UqID<any>;
	WarehouseN: UqID<any>;
	PickupDetail: UqID<any>;
	ItemResearch: UqID<any>;
	ItemProductPack: UqID<any>;
	ItemProductPackLot: UqID<any>;
	DxPicking: UqIDX<any>;
	OrderDetailX: UqIDX<any>;
	WarehouseSection: UqIX<any>;
	ItemStore: UqIX<any>;
	IxUserWarehouse: UqIX<any>;
	IxPendingPickup: UqIX<any>;
}
