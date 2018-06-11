
/**
 * 
 * @param   时间戳
 * @return   yyyy-MM-dd hh:mm 格式的时间
 */
export const toNomalTime = (timestamp)=> {
    const date = new Date(timestamp*1000) ,
     Y = date.getFullYear() + '-',
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
    D = date.getDate() + ' ',
    h = date.getHours() + ':',
    m = date.getMinutes();
    return Y+M+D+h+m
}
