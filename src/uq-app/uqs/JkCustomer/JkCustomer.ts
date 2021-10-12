//=== UqApp builder created on Tue Oct 12 2021 23:02:26 GMT+0800 (China Standard Time) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqQuery, UqMap, UqHistory, UqIX } from "tonva-react";


//===============================
//======= UQ 百灵威系统工程部/customer ========
//===============================

export interface TuidCurrency {
    id?: number;
    name: string;
    suffix: string;
}

export interface TuidContact {
    id?: number;
    name: string;
    organizationName: string;
    mobile: string;
    telephone: string;
    email: string;
    addressString: string;
    address: number;
}

export interface TuidCustomer {
    id?: number;
    name: string;
    firstName: string;
    lastName: string;
    xyz: string;
    no: string;
    gender: string;
    salutation: string;
    birthDay: any;
    createTime: any;
    isValid: number;
}

export interface TuidInvoiceType {
    id?: number;
    description: string;
}

export interface TuidResearch {
    id?: number;
    name: string;
    no: string;
    createTime: any;
}

export interface Tuid$sheet {
    id?: number;
    no: string;
    user: number;
    date: any;
    sheet: number;
    version: number;
    flow: number;
    app: number;
    state: number;
    discription: string;
    data: string;
    processing: number;
}

export interface Tuid$user {
    id?: number;
    name: string;
    nick: string;
    icon: string;
    assigned: string;
    poke: number;
}

export interface TuidProvince {
    id?: number;
    country: number;
    englishName: string;
    chineseName: string;
    no: string;
}

export interface TuidDepartment {
    id?: number;
    name: string;
    organization: number;
    no: string;
    createTime: any;
}

export interface TuidBuyerAccount {
    id?: number;
    description: string;
    organization: number;
    xyz: string;
    no: string;
    createTime: any;
    isValid: number;
}

export interface TuidOrganization {
    id?: number;
    name: string;
    no: string;
    createTime: any;
}

export interface TuidCountry {
    id?: number;
    code: string;
    englishName: string;
    chineseName: string;
    no: string;
}

export interface TuidInvoiceInfo {
    id?: number;
    title: string;
    taxNo: string;
    address: string;
    telephone: string;
    bank: string;
    accountNo: string;
    invoiceType: string;
}

export interface TuidCity {
    id?: number;
    province: number;
    englishName: string;
    chineseName: string;
    no: string;
}

export interface TuidPost {
    id?: number;
    name: string;
    no: string;
    createTime: any;
}

export interface TuidCounty {
    id?: number;
    city: number;
    englishName: string;
    chineseName: string;
    no: string;
}

export interface TuidSalesRegion {
    id?: number;
    name: string;
    currency: number;
    no: string;
}

export interface TuidEmployee {
    id?: number;
    no: string;
    name: string;
    firstName: string;
    lastName: string;
    title: string;
    Status: string;
    CreateTime: any;
}

export interface TuidAddress {
    id?: number;
    country: number;
    province: number;
    city: number;
    county: number;
    zip: string;
    description: string;
}

export interface TuidDomain {
    id?: number;
    name: string;
    parent: number;
    no: string;
    createTime: any;
}

export interface TuidProductX {
    id?: number;
    brand: number;
    origin: string;
    description: string;
    descriptionC: string;
}

export interface TuidBrand {
    id?: number;
    name: string;
}

export interface TuidCustomerSettingType {
    id?: number;
    description: string;
}

export interface TuidVIPCardType {
    id?: number;
}

export interface ParamSearchCustomer {
    key: string;
}
export interface ReturnSearchCustomer$page {
    id: number;
    no: string;
    name: string;
    firstName: string;
    lastName: string;
    gender: string;
    salutation: string;
}
export interface ResultSearchCustomer {
    $page: ReturnSearchCustomer$page[];
}

export interface ParamGetBuyerAccountByNo {
    buyAccountNo: string;
}
export interface ReturnGetBuyerAccountByNoRet {
    buyerAccount: number;
    organization: number;
    description: string;
    xyz: string;
    no: string;
    createTime: any;
    isValid: number;
}
export interface ResultGetBuyerAccountByNo {
    ret: ReturnGetBuyerAccountByNoRet[];
}

export interface ParamGetCustomerByNo {
    customerNo: string;
}
export interface ReturnGetCustomerByNoRet {
    customer: number;
}
export interface ResultGetCustomerByNo {
    ret: ReturnGetCustomerByNoRet[];
}

export interface ParamGetCustomerOrganization {
    customerId: number;
}
export interface ReturnGetCustomerOrganizationRet {
    organization: number;
    customer: number;
}
export interface ResultGetCustomerOrganization {
    ret: ReturnGetCustomerOrganizationRet[];
}

export interface ParamGetCustomerByKey {
    key: string;
}
export interface ReturnGetCustomerByKeyRet {
    customer: number;
}
export interface ResultGetCustomerByKey {
    ret: ReturnGetCustomerByKeyRet[];
}

export interface ParamSearchDomain {
    _parent: number;
}
export interface ReturnSearchDomain$page {
    id: number;
    name: string;
    counts: number;
}
export interface ResultSearchDomain {
    $page: ReturnSearchDomain$page[];
}

export interface Param$poked {
}
export interface Return$pokedRet {
    poke: number;
}
export interface Result$poked {
    ret: Return$pokedRet[];
}

export interface ParamGetMyUsedCoupon {
    customer: number;
}
export interface ReturnGetMyUsedCoupon$page {
    seq: number;
    id: number;
    code: number;
    types: string;
    useddate: any;
}
export interface ResultGetMyUsedCoupon {
    $page: ReturnGetMyUsedCoupon$page[];
}

export interface ParamGetMyExpiredCoupon {
    customer: number;
}
export interface ReturnGetMyExpiredCoupon$page {
    seq: number;
    id: number;
    code: number;
    types: string;
    createdate: any;
    expireddate: any;
}
export interface ResultGetMyExpiredCoupon {
    $page: ReturnGetMyExpiredCoupon$page[];
}

export interface ParamCustomerSalesmanHistory {
    customer: number;
    salesman: number;
    operation: number;
    createDate: any;
}
export interface ReturnCustomerSalesmanHistory$page {
    date: any;
    customer: number;
    salesman: number;
    operation: number;
    createDate: any;
}
export interface ResultCustomerSalesmanHistory {
    $page: ReturnCustomerSalesmanHistory$page[];
}

export interface CustomerSalesman {
    ix: number;
    xi: number;
    unLockOn: any;
}

export interface ParamActs {
    customerSalesman?: CustomerSalesman[];
}


export interface UqExt extends Uq {
    Acts(param: ParamActs): Promise<any>;

    Currency: UqTuid<TuidCurrency>;
    Contact: UqTuid<TuidContact>;
    Customer: UqTuid<TuidCustomer>;
    InvoiceType: UqTuid<TuidInvoiceType>;
    Research: UqTuid<TuidResearch>;
    $sheet: UqTuid<Tuid$sheet>;
    $user: UqTuid<Tuid$user>;
    Province: UqTuid<TuidProvince>;
    Department: UqTuid<TuidDepartment>;
    BuyerAccount: UqTuid<TuidBuyerAccount>;
    Organization: UqTuid<TuidOrganization>;
    Country: UqTuid<TuidCountry>;
    InvoiceInfo: UqTuid<TuidInvoiceInfo>;
    City: UqTuid<TuidCity>;
    Post: UqTuid<TuidPost>;
    County: UqTuid<TuidCounty>;
    SalesRegion: UqTuid<TuidSalesRegion>;
    Employee: UqTuid<TuidEmployee>;
    Address: UqTuid<TuidAddress>;
    Domain: UqTuid<TuidDomain>;
    ProductX: UqTuid<TuidProductX>;
    Brand: UqTuid<TuidBrand>;
    CustomerSettingType: UqTuid<TuidCustomerSettingType>;
    VIPCardType: UqTuid<TuidVIPCardType>;
    SearchCustomer: UqQuery<ParamSearchCustomer, ResultSearchCustomer>;
    GetBuyerAccountByNo: UqQuery<ParamGetBuyerAccountByNo, ResultGetBuyerAccountByNo>;
    GetCustomerByNo: UqQuery<ParamGetCustomerByNo, ResultGetCustomerByNo>;
    GetCustomerOrganization: UqQuery<ParamGetCustomerOrganization, ResultGetCustomerOrganization>;
    GetCustomerByKey: UqQuery<ParamGetCustomerByKey, ResultGetCustomerByKey>;
    SearchDomain: UqQuery<ParamSearchDomain, ResultSearchDomain>;
    $poked: UqQuery<Param$poked, Result$poked>;
    GetMyUsedCoupon: UqQuery<ParamGetMyUsedCoupon, ResultGetMyUsedCoupon>;
    GetMyExpiredCoupon: UqQuery<ParamGetMyExpiredCoupon, ResultGetMyExpiredCoupon>;
    CustomerDepartment: UqMap;
    CustomerSetting: UqMap;
    CustomerContractor: UqMap;
    CustomerHandler: UqMap;
    CustomerResearch: UqMap;
    CustomerBuyerAccount: UqMap;
    OrganizationCustomer: UqMap;
    PostRelation: UqMap;
    CustomerContacts: UqMap;
    CustomerPost: UqMap;
    CustomerDomain: UqMap;
    CustomerRelatedProducts: UqMap;
    ResearchDomain: UqMap;
    OrganizationSetting: UqMap;
    CustomerSettingAlter: UqMap;
    CustomerCreditsUsed: UqMap;
    CustomerCredits: UqMap;
    CustomerCoupon: UqMap;
    CustomerCouponUsed: UqMap;
    CustomerSalesmanHistory: UqHistory<ParamCustomerSalesmanHistory, ResultCustomerSalesmanHistory>;
    CustomerSalesman: UqIX<any>;
}

export function assign(uq: any, to: string, from: any): void {
    Object.assign((uq as any)[to], from);
}
