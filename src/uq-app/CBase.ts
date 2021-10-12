//=== UqApp builder created on Tue Oct 12 2021 23:02:23 GMT+0800 (China Standard Time) ===//
import { CSub, CBase, CAppBase, IConstructor } from 'tonva-react';
import { UQs } from './uqs';
import { CApp } from './CApp';

export abstract class CUqBase extends CBase<CApp, UQs> {
}

export abstract class CUqSub<A extends CAppBase<U>, U, T extends CBase<A, U>> extends CSub<A, U, T> {
}

export abstract class CUqApp extends CAppBase<UQs> {
    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        let c = new type(this);
        c.init();
        return c;
    }
}
