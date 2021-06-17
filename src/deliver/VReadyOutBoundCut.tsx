import { observer } from 'mobx-react';
import { Page, VPage, List, tv, DropdownActions, DropdownAction, EasyTime } from 'tonva-react';
import { COutBound } from './COutBound';
//import { format } from 'date-fns';

export class VReadyOutBoundCut extends VPage<COutBound> {

    readyOutBoundList: any[];
    warehouse: any;

    async open(outBoundList: any) {
        let { readyOutBoundList, warehouse } = outBoundList;
        this.readyOutBoundList = readyOutBoundList;
        this.warehouse = warehouse;
        this.openPage(this.page);
    }

    private renderReadyOutBoundCut(readyOutBoundList: any) {

        let { $id, consigneeUnitName, consigneeName, product, pack, quantity, outBoundTime, outBoundReason } = readyOutBoundList;

        return <div className="row d-flex px-1 py-1">
            <div className="col-12">
                <div className="row">
                    <div className="col-8"><strong>{consigneeUnitName}</strong></div>
                    <div className="col-4"><strong>{consigneeName}</strong></div>
                </div>
                <div className="row py-1">
                    <div className="col-3 text-muted">
                        {tv(outBoundReason, (values: any) => <>{values.name}</>)}
                    </div>
                    <div className="col-9">
                        <div className="row">
                            {tv(product, (values: any) => <>{item("产品编号", values.origin)}</>)}
                            {tv(pack, (values: any) => <>{item("包装", tvPackx(values))}</>)}
                            {item('数量', quantity)}
                            {item('出库时间', <EasyTime date={outBoundTime} /> /*format(outBoundTime, 'yyyy-MM-dd HH:mm')*/)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    };

    // 打开出库单历史界面
    private openOutBoundOrderHistoryPage = async () => {
        this.controller.openOutBoundOrderHistoryPage(this.warehouse);
    }

    private page = observer(() => {

        let { outBoundCutOff } = this.controller;
        let header = <header>
            <div className="px-0"><span>待出库任务列表</span></div>
        </header>;

        let actions: DropdownAction[] = [
            {
                icon: 'book',
                caption: '出库单历史',
                action: this.openOutBoundOrderHistoryPage
            }
        ];

        let right = <DropdownActions className="align-self-center mr-1" icon="ellipsis-v" actions={actions} />;
        let footer = <button type="button" className="btn btn-primary w-100" onClick={() => outBoundCutOff()} >截单</button>;
        let tastList = <List items={this.readyOutBoundList} item={{ render: this.renderReadyOutBoundCut }} none="无待截单数据" />;

        return <Page header={header} right={right} footer={footer}>
            {tastList}
        </Page>
    });
};

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}

function item(caption: string, value: any) {
    if (value === null || value === undefined) return null;
    return <>
        <div className="col-4 text-muted pr-0">{caption}：</div>
        <div className="col-8">{value}</div>
    </>;
}