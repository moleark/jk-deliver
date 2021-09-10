import { VPage, Schema, UiSchema, UiInputItem, UiSelect, Form, autoHideTips, Context } from "tonva-react";
import * as React from 'react';
import { observable } from "mobx";
import { observer } from 'mobx-react';
import { CFind } from "./CFind";

const schema: Schema = [
    { name: 'id', type: 'number', required: false },
    { name: 'name', type: 'string', required: true },
    { name: 'customer', type: 'number', required: false },
    { name: 'tradeType', type: 'number', required: false }
];

export class VCutOffTypeEdit extends VPage<CFind> {

    private cutOffType: any;
    init(param: any) {
        this.cutOffType = param;
    }

    private form: Form;
    createUserTip = observable.box<string>("");     /* 提交 创建用户提示 */
    /*
    private outBoundReasonList: any[] = [{ value: "0", title: "请选择出库原因" }].concat(this.controller.outBoundReasonList
        .filter((el: any) => el && el.id).map((el: any) => { return { value: el.id, title: el.name } }));
    private cutOffTypeCustomerList: any[] = [{ value: "请选择客户", title: "请选择客户" }].concat(this.controller.cutOffTypeCustomerList
        .filter((el: any) => el && el.id).map((el: any) => { return { value: el.id, title: el.name } }));
    */
    private tradeTypeList: any[] = [
        { value: "", title: "请选择出库类型：" },
        { value: "xx2", title: "盘亏出库" },
        { value: "xx3", title: "报废出库" },
        { value: "xx4", title: "研发出库" },
        { value: "xx5", title: "异地调库" },
    ]

    private uiSchema: UiSchema = {
        items: {
            id: { widget: 'text', label: '截单类型Id', visible: false } as UiInputItem,
            name: { widget: 'text', label: '截单类型名称', placeholder: '请输入截单类型名称' } as UiInputItem,
            customer: { widget: 'text', label: '客户id', placeholder: '请输入客户id' } as UiInputItem,
            tradeType: { widget: 'select', label: '出库类型', list: this.tradeTypeList } as UiSelect,
            submit: { widget: 'button', label: '新增', className: 'btn btn-primary w-8c' }
        }
    };

    header() { return '编辑' }

    footer() {
        if (this.cutOffType === undefined) {
            return <div className="text-center">
                <button onClick={() => this.onSaveCutOffType()} className="btn btn-success w-50" type="button">保存</button>
            </div>
        } else {
            let { id } = this.cutOffType;
            return <div className="text-center">
                <button onClick={() => this.onDeleteCutOffType(id)} className="btn btn-danger w-50" type="button">删除</button>
                <button onClick={() => this.onSaveCutOffType()} className="btn btn-success w-50" type="button">保存</button>
            </div>
        }
    }

    content() {

        let { JkDeliver } = this.controller.uqs;
        let { CutOffType } = JkDeliver;

        return React.createElement(observer(() => {
            let selectOrganiza: JSX.Element;
            selectOrganiza = <Form ref={v => this.form = v} className="my-3"
                schema={schema}
                uiSchema={this.uiSchema}
                formData={this.cutOffType}
                onButtonClick={this.onFormButtonClick}
                fieldLabelSize={3} />
            return <div className="p-2">
                {selectOrganiza}
                {autoHideTips(this.createUserTip, <div className="alert alert-success text-danger" role="alert"> {this.createUserTip.get()}</div>)}
            </div>
        }));
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        await this.controller.saveCutOffType(context.form.data);
    }

    private onSaveCutOffType = async () => {
        if (!this.form) return;
        await this.form.buttonClick('submit');
    }

    private onDeleteCutOffType = async (cutOffTypeId: number) => {
        let { deleteCutOfftype } = this.controller;
        await deleteCutOfftype(cutOffTypeId);
    }
}