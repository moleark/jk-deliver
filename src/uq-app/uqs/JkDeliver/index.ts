import { UqExt as Uq } from './JkDeliver';
import * as $PiecewiseDetail from './$PiecewiseDetail.ui';
import * as OrderMain from './OrderMain.ui';
import * as OrderDetail from './OrderDetail.ui';
import * as $Piecewise from './$Piecewise.ui';
import * as Warehouse from './Warehouse.ui';
import * as DxOrderDetail from './DxOrderDetail.ui';
import * as DxReturnDetail from './DxReturnDetail.ui';
import * as IxPendingDeliver from './IxPendingDeliver.ui';
import * as IxCustomerPendingReturn from './IxCustomerPendingReturn.ui';
import * as IxUserWarehouse from './IxUserWarehouse.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.$PiecewiseDetail, $PiecewiseDetail);
	Object.assign(uq.OrderMain, OrderMain);
	Object.assign(uq.OrderDetail, OrderDetail);
	Object.assign(uq.$Piecewise, $Piecewise);
	Object.assign(uq.Warehouse, Warehouse);
	Object.assign(uq.DxOrderDetail, DxOrderDetail);
	Object.assign(uq.DxReturnDetail, DxReturnDetail);
	Object.assign(uq.IxPendingDeliver, IxPendingDeliver);
	Object.assign(uq.IxCustomerPendingReturn, IxCustomerPendingReturn);
	Object.assign(uq.IxUserWarehouse, IxUserWarehouse);
}
export * from './JkDeliver';
