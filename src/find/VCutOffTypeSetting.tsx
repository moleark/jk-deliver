import { tv, VPage, LMR, List, FA, ID } from "tonva-react";
import { CFind } from "./CFind";

export class VCutOffTypeSetting extends VPage<CFind> {

    private cutOffTypeList: any[];
    init(param: any) {
        this.cutOffTypeList = param;
    }

    header() { return '截单类型设置' }

    footer() {
        let { openAddCutOffType } = this.controller;
        return <div className="text-center">
            <button type="button" className="btn btn-primary w-100" onClick={() => openAddCutOffType()} >添加</button>
        </div>
    }

    content() {

        let { JkDeliver } = this.controller.uqs;
        // let { CutOffType } = JkDeliver;
        // let { fieldArr, fields } = CutOffType.ui;
        return <div>
            <List items={this.cutOffTypeList} item={{ render: this.renderType }} none="无截单类型数据" />
        </div>
    }

    editCutOffType = async (cutOffTypeId: number) => {
        let { openEditCutOffType } = this.controller;
        await openEditCutOffType(cutOffTypeId);
    }

    private renderType = (item: any) => {

        //let { deleteCutOfftype } = this.controller;
        let { cutOffType, no } = item;
        let right = <div className="p-1 cursor-pointer text-info" onClick={() => this.editCutOffType(cutOffType)}>
            <FA name="edit" className="align-self-center" />
        </div>
        return <div className="p-2 d-block">
            <LMR right={right} >
                {no}
            </LMR>
        </div >
    }

}