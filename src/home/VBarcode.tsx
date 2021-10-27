/* eslint-disable */
import { tv, Page, VPage, LMR, List } from "tonva-react";
import { CHome } from ".";
import { observer } from 'mobx-react';
import * as React from "react";

export class VBarcode extends VPage<CHome> {

    scan: any;
    init(param: any) {
        setTimeout(() => {
            this.media();
        }, 5);
    }

    media = () => {
        if (navigator.userAgent.indexOf("Html5Plus") > -1) {
            // @ts-ignore 
            let arr = [plus.barcode.QR, plus.barcode.EAN13, plus.barcode.EAN8, plus.barcode.AZTEC, plus.barcode.DATAMATRIX, plus.barcode.UPCA, plus.barcode.UPCE, plus.barcode.CODABAR, plus.barcode.CODE39, plus.barcode.CODE93, plus.barcode.CODE128, plus.barcode.ITF, plus.barcode.MAXICODE, plus.barcode.PDF417, plus.barcode.RSS14, plus.barcode.RSSEXPANDED,];

            // @ts-ignore 
            this.scan = new plus.barcode.Barcode('bcid', arr,
                { frameColor: '#00FF00', scanbarColor: '#00FF00' });
            this.scan.onmarked = this.onmarked;
            this.scan.onerror = this.onerror;
            this.scan.start();
        }
    }

    onerror = async (error: any) => {
        console.log('============== message ==============');
        console.log(error.message);
        console.log('============== message ==============');
    };

    onmarked = async (type: any, result: any) => {
        let text: string = '';
        console.log('============== type ==============');
        console.log(type);
        console.log('============== type ==============');
        switch (type) {
            // @ts-ignore 
            case plus.barcode.QR:
                text = 'QR';
                break;
            // @ts-ignore 
            case plus.barcode.EAN13:
                text = 'EAN13';
                break;
            // @ts-ignore 
            case plus.barcode.EAN8:
                text = 'EAN8';
                break;
        }
        // '912152 LT40U57 Jkchemical 1'   

        console.log('============== result ==============');
        console.log(result);
        console.log('============== result ==============');
        if (!text) {
            alert('此码无法解析额');
            this.close();
            return;
        };
        // 解析字符串方法
        await this.controller.convertProductNumber(result);
        this.close();
    }

    scanClose = () => {
        if (navigator.userAgent.indexOf("Html5Plus") > -1) {
            // @ts-ignore 
            this.scan.close();
        };
    }

    close = () => {
        this.scanClose();
        this.closePage();
    }

    afterBack = () => { this.close(); };

    header() { return <div className="w-100 text-center">扫一扫</div> }

    content() {
        return <div id='bcid' style={{ width: "100vw", height: "90vh", background: '#F5F5F5' }}></div>
    }
}