import { UqExt as Uq } from './JkDeliver';
import * as OrderMain from './OrderMain.ui';
import * as OrderDetail from './OrderDetail.ui';
import * as Warehouse from './Warehouse.ui';
import * as DeliverMain from './DeliverMain.ui';
import * as DeliverDetail from './DeliverDetail.ui';
import * as DeliverMainEx from './DeliverMainEx.ui';
import * as CutOffMain from './CutOffMain.ui';
import * as DxOrderDetail from './DxOrderDetail.ui';
import * as DxReturnDetail from './DxReturnDetail.ui';
import * as OrderDetailX from './OrderDetailX.ui';
import * as DxDeliverMain from './DxDeliverMain.ui';
import * as DXDeliverDetail from './DXDeliverDetail.ui';
import * as DxCutOffMain from './DxCutOffMain.ui';
import * as IxPendingDeliver from './IxPendingDeliver.ui';
import * as IxUserWarehouse from './IxUserWarehouse.ui';
import * as IxWarehouseDeliverMain from './IxWarehouseDeliverMain.ui';
import * as IxWarehouseCutOffMain from './IxWarehouseCutOffMain.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.OrderMain, OrderMain);
	Object.assign(uq.OrderDetail, OrderDetail);
	Object.assign(uq.Warehouse, Warehouse);
	Object.assign(uq.DeliverMain, DeliverMain);
	Object.assign(uq.DeliverDetail, DeliverDetail);
	Object.assign(uq.DeliverMainEx, DeliverMainEx);
	Object.assign(uq.CutOffMain, CutOffMain);
	Object.assign(uq.DxOrderDetail, DxOrderDetail);
	Object.assign(uq.DxReturnDetail, DxReturnDetail);
	Object.assign(uq.OrderDetailX, OrderDetailX);
	Object.assign(uq.DxDeliverMain, DxDeliverMain);
	Object.assign(uq.DXDeliverDetail, DXDeliverDetail);
	Object.assign(uq.DxCutOffMain, DxCutOffMain);
	Object.assign(uq.IxPendingDeliver, IxPendingDeliver);
	Object.assign(uq.IxUserWarehouse, IxUserWarehouse);
	Object.assign(uq.IxWarehouseDeliverMain, IxWarehouseDeliverMain);
	Object.assign(uq.IxWarehouseCutOffMain, IxWarehouseCutOffMain);
}
export * from './JkDeliver';
