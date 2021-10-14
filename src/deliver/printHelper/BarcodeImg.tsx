import React, { Component } from 'react';
import JsBarcode from 'jsbarcode';
import PropTypes from 'prop-types';

export default class Barcode extends Component {

    static defaultProps = {
        format: 'CODE128',
        renderer: 'img',
        width: 2,
        height: 30,
        displayValue: true,
        textAlign: 'center',
        fontSize: 20,
        textMargin: 6,
        margin: 10,
        // textPosition: 'top', background: '#ffffff',lineColor: '#000000', marginBottom: 24,
    };

    static propTypes = {
        value: PropTypes.string.isRequired,
        renderer: PropTypes.string,
        format: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        displayValue: PropTypes.bool,
        textAlign: PropTypes.string,
        fontSize: PropTypes.number,
        textMargin: PropTypes.number,
        margin: PropTypes.number,
        // textPosition: PropTypes.string, background: PropTypes.string,
        // lineColor: PropTypes.string, marginBottom: PropTypes.number,
    };

    barcode: any;
    constructor(props: any) {
        super(props);
        this.update = this.update.bind(this);
    };

    componentDidMount() {
        this.update();
    };

    componentDidUpdate() {
        this.update();
    };

    handleBarcode = (r: any) => {
        this.barcode = r;
    }

    update() {
        const {
            value,
            format,
            width,
            height,
            displayValue,
            textAlign,
            fontSize,
            textMargin,
            margin,
            // textPosition, background, lineColor, marginBottom,
        } = this.props as any;

        JsBarcode(this.barcode, value, {
            format,
            width,
            height,
            displayValue,
            textAlign,
            fontSize,
            textMargin,
            margin
            // textPosition, background, lineColor, marginBottom
        })
    };

    render() {
        return (
            <img ref={this.handleBarcode} alt="" />
        );
    };
}