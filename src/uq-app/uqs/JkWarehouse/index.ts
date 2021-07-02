import { UqExt as Uq } from './JkWarehouse';
import * as StorePoint from './StorePoint.ui';
import * as Item from './Item.ui';
import * as Section from './Section.ui';
import * as OrderMain from './OrderMain.ui';
import * as Pickup from './Pickup.ui';
import * as OrderDetail from './OrderDetail.ui';
import * as WarehouseN from './WarehouseN.ui';
import * as PickupDetail from './PickupDetail.ui';
import * as ItemResearch from './ItemResearch.ui';
import * as ItemProductPack from './ItemProductPack.ui';
import * as ItemProductPackLot from './ItemProductPackLot.ui';
import * as DxPicking from './DxPicking.ui';
import * as OrderDetailX from './OrderDetailX.ui';
import * as WarehouseSection from './WarehouseSection.ui';
import * as ItemStore from './ItemStore.ui';
import * as IxUserWarehouse from './IxUserWarehouse.ui';
import * as IxPendingPickup from './IxPendingPickup.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.StorePoint, StorePoint);
	Object.assign(uq.Item, Item);
	Object.assign(uq.Section, Section);
	Object.assign(uq.OrderMain, OrderMain);
	Object.assign(uq.Pickup, Pickup);
	Object.assign(uq.OrderDetail, OrderDetail);
	Object.assign(uq.WarehouseN, WarehouseN);
	Object.assign(uq.PickupDetail, PickupDetail);
	Object.assign(uq.ItemResearch, ItemResearch);
	Object.assign(uq.ItemProductPack, ItemProductPack);
	Object.assign(uq.ItemProductPackLot, ItemProductPackLot);
	Object.assign(uq.DxPicking, DxPicking);
	Object.assign(uq.OrderDetailX, OrderDetailX);
	Object.assign(uq.WarehouseSection, WarehouseSection);
	Object.assign(uq.ItemStore, ItemStore);
	Object.assign(uq.IxUserWarehouse, IxUserWarehouse);
	Object.assign(uq.IxPendingPickup, IxPendingPickup);
}
export * from './JkWarehouse';
