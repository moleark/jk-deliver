///+++import AppUQs+++///
import {UQs as AppUQs} from '../appUQs';
///###import AppUQs###///
//=== UqApp builder created on Wed Sep 08 2021 10:48:32 GMT+0800 (中国标准时间) ===//
import * as JkDeliver from './JkDeliver';
import * as JkWarehouse from './JkWarehouse';
import * as JkProduct from './JkProduct';
import * as JkCustomer from './JkCustomer';

export interface UQs extends AppUQs {
	JkDeliver: JkDeliver.UqExt;
	JkWarehouse: JkWarehouse.UqExt;
	JkProduct: JkProduct.UqExt;
	JkCustomer: JkCustomer.UqExt;
}

export * as JkDeliver from './JkDeliver';
export * as JkWarehouse from './JkWarehouse';
export * as JkProduct from './JkProduct';
export * as JkCustomer from './JkCustomer';

export function setUI(uqs:UQs) {
	JkDeliver.setUI(uqs.JkDeliver);
	JkWarehouse.setUI(uqs.JkWarehouse);
	JkProduct.setUI(uqs.JkProduct);
	JkCustomer.setUI(uqs.JkCustomer);
}
