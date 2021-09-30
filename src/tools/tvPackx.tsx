/**
 * 包装格式
 * @param values 
 * @returns 
 */
export const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}