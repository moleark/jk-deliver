//=== UqApp builder created on Tue Jun 08 2021 18:28:37 GMT-0400 (GMT-04:00) ===//
//=== UqApp builder created on Tue Jun 08 2021 22:42:29 GMT-0400 (GMT-04:00) ===//
import * as BzHelloTonva from './BzHelloTonva';
import * as JkDeliver from './JkDeliver';

export interface UQs /*extends AppUQs*/ {
	BzHelloTonva: BzHelloTonva.UqExt;
	JkDeliver: JkDeliver.UqExt;
}

export * as BzHelloTonva from './BzHelloTonva';
export * as JkDeliver from './JkDeliver';

export function setUI(uqs:UQs) {
	BzHelloTonva.setUI(uqs.BzHelloTonva);
	JkDeliver.setUI(uqs.JkDeliver);
}
