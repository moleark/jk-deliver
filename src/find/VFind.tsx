import { Prop, PropGrid, VPage, IconText } from "tonva-react";
import { CFind } from "./CFind";

export class VFind extends VPage<CFind> {

    header() { return '发现'; }

    content() {
        let { onOpenCutOffTypeSetting } = this.controller;

        let arr: [string, () => void][] = [
            //['库存查询', null],
            //['发货查询', null],
            //['出库单', null],
            //['入库单', null],
            ['截单类型设置', onOpenCutOffTypeSetting]
        ];

        let rows: Prop[] = arr.map(v => ({
            type: 'component',
            component: <IconText iconClass="text-info mr-2" icon="info-circle" text={v[0]} />,
            onClick: v[1]
        }));
        /*
        rows = [
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="info-circle" text="库存查询" />,
                onClick: null
            },
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="info-circle" text="发货查询" />,
                onClick: null
            },
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="info-circle" text="出库单历史" />,
                onClick: openOutBoundOrderHistory
            },
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="info-circle" text="入库单历史" />,
                onClick: null
            },
            '',
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="sign-out" text="出库任务处理" />,
                onClick: searchReadyOutBoundCutTastList
            },
            '',
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="sign-in" text="入库任务处理" />,
                onClick: null
            }
        ]
        */

        return <PropGrid className="px-2" rows={rows} values={{}} />;
        /*
        return <div>
            <div>查询1</div>
            <div>查询2</div>
        </div>;
        */
    }
}
