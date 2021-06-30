///+++import AppUQs+++///
import {UQs as AppUQs} from '../appUQs';
///###import AppUQs###///
//=== UqApp builder created on Tue Jun 29 2021 22:58:37 GMT-0400 (GMT-04:00) ===//
import * as BzHelloTonva from './BzHelloTonva';
import * as JkDeliver from './JkDeliver';
import * as JkWarehouse from './JkWarehouse';

export interface UQs extends AppUQs {
	BzHelloTonva: BzHelloTonva.UqExt;
	JkDeliver: JkDeliver.UqExt;
	JkWarehouse: JkWarehouse.UqExt;
}

export * as BzHelloTonva from './BzHelloTonva';
export * as JkDeliver from './JkDeliver';
export * as JkWarehouse from './JkWarehouse';

export function setUI(uqs:UQs) {
	BzHelloTonva.setUI(uqs.BzHelloTonva);
	JkDeliver.setUI(uqs.JkDeliver);
	JkWarehouse.setUI(uqs.JkWarehouse);
}
