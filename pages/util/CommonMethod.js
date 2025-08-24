function generateGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000) // 生成一个 16 进制的随机数
            .toString(16) // 转换为十六进制
            .substring(1); // 去掉开头的 0
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4(); // 组合成 GUID 格式
}

export default {
    generateGUID
}