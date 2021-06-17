///+++import AppUQs+++///
import {UQs as AppUQs} from '../appUQs';
///###import AppUQs###///
//=== UqApp builder created on Wed Jun 16 2021 20:01:25 GMT-0400 (GMT-04:00) ===//
import * as BzHelloTonva from './BzHelloTonva';
import * as JkDeliver from './JkDeliver';

export interface UQs extends AppUQs {
	BzHelloTonva: BzHelloTonva.UqExt;
	JkDeliver: JkDeliver.UqExt;
}

export * as BzHelloTonva from './BzHelloTonva';
export * as JkDeliver from './JkDeliver';

export function setUI(uqs:UQs) {
	BzHelloTonva.setUI(uqs.BzHelloTonva);
	JkDeliver.setUI(uqs.JkDeliver);
}
