/**
 * Canvas订单图片生成辅助类
 * 用于将订单信息绘制成票据样式的图片
 */

export default class CanvasOrderHelper {
	constructor(ctx, canvasWidth, canvasHeight) {
		this.ctx = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.padding = 30;
	}

	/**
	 * 计算Canvas高度
	 */
	static calculateHeight(productItems, basketOffsetNum) {
		let height = 40; // 初始顶部间距
		height += 50; // 标题
		height += 45; // 副标题
		height += 55; // 市场名称
		height += 50; // 客户和票号行
		height += 45; // 日期
		height += 30; // 间距
		height += 50; // 表头
		height += productItems.length * 45; // 商品行
		height += 45; // 合计行
		
		if (basketOffsetNum > 0) {
			height += 45; // 还筐行
		}
		
		height += 30; // 间距
		height += 50; // 本单合计
		height += 70; // 本单合计后的间距
		height += 45; // 实付/实退行
		height += 30; // 分割线前间距
		height += 40; // 底部信息
		height += 100; // logo高度和留白
		
		return height;
	}

	/**
	 * 计算还筐信息
	 */
	static calculateBasketInfo(products) {
		let basketOffsetNum = 0;
		let basketInfo = '';
		
		products.forEach(item => {
			if (item.type === 4) {
				basketOffsetNum += parseInt(item.mount || 0);
				basketInfo += `${item.name}:${item.mount};`;
			}
		});
		
		return { basketOffsetNum, basketInfo };
	}

	/**
	 * 绘制白色背景
	 */
	drawBackground() {
		this.ctx.setFillStyle('#FFFFFF');
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	/**
	 * 绘制头部信息
	 */
	drawHeader(voucherTitle, companyName, order) {
		const { ctx, canvasWidth, padding } = this;
		let y = 40;

		// 1. 标题
		ctx.setFillStyle('#000000');
		ctx.setFontSize(40);
		ctx.setTextAlign('center');
		ctx.fillText(voucherTitle, canvasWidth / 2, y);
		y += 50;

		// 2. 副标题
		ctx.setFontSize(20);
		ctx.fillText('广东省食用农产品批发市场销售票据', canvasWidth / 2, y);
		y += 30;
		ctx.fillText('(广州江南果菜批发市场)', canvasWidth / 2, y);
		y += 45;

		// 3. 市场名称
		ctx.setFontSize(32);
		ctx.fillText(companyName, canvasWidth / 2, y);
		y += 55;

		// 4. 客户和票号
		ctx.setTextAlign('left');
		ctx.setFontSize(26);
		ctx.fillText('客户：' + (order.customName || '散客'), padding, y);
		ctx.setTextAlign('right');
		ctx.fillText('票号：' + (order.accountCode || ''), canvasWidth - padding, y);
		y += 45;

		// 5. 日期
		const createTime = order.createTime ? order.createTime.replace('T', ' ').substring(0, 16) : '';
		ctx.setTextAlign('right');
		ctx.fillText(createTime, canvasWidth - padding, y);
		y += 30;

		return y;
	}

	/**
	 * 绘制表格头部
	 */
	drawTableHeader(y, tableX, tableWidth, colWidths) {
		const { ctx } = this;

		y += 30;

		// 表头背景
		ctx.setFillStyle('#F5F5F5');
		ctx.fillRect(tableX, y - 35, tableWidth, 45);

		// 表头文字
		ctx.setFillStyle('#000000');
		ctx.setFontSize(24);

		let currentX = tableX;
		const headers = ['#', '货品', '数量', '重量', '单价', '小计'];

		headers.forEach((header, index) => {
			if (index === 0) {
				ctx.setTextAlign('center');
				ctx.fillText(header, currentX + colWidths[index] / 2, y);
			} else if (index === 1) {
				ctx.setTextAlign('left');
				ctx.fillText(header, currentX + 5, y);
			} else if (index === 5) {
				ctx.setTextAlign('right');
				ctx.fillText(header, currentX + colWidths[index] - 10, y);
			} else {
				ctx.setTextAlign('center');
				ctx.fillText(header, currentX + colWidths[index] / 2, y);
			}
			currentX += colWidths[index];
		});

		y += 15;

		// 表头下边框
		ctx.setStrokeStyle('#000000');
		ctx.setLineWidth(2);
		ctx.beginPath();
		ctx.moveTo(tableX, y);
		ctx.lineTo(tableX + tableWidth, y);
		ctx.stroke();
		y += 35;

		return y;
	}

	/**
	 * 绘制商品行
	 */
	drawProductRows(y, tableX, colWidths, amountRightX, productItems) {
		const { ctx } = this;
		let totalAmount = 0;

		productItems.forEach((item, index) => {
			const rowY = y;
			let currentX = tableX;

			ctx.setFillStyle('#000000');
			ctx.setFontSize(22);

			// 序号
			ctx.setTextAlign('center');
			ctx.fillText((index + 1).toString(), currentX + colWidths[0] / 2, rowY);
			currentX += colWidths[0];

			// 货品名称
			ctx.setTextAlign('left');
			ctx.fillText(item.name || '', currentX + 5, rowY);
			currentX += colWidths[1];

			// 数量
			ctx.setTextAlign('center');
			const mountText = item.type === 2 ? item.mount + '' : item.mount + '件';
			ctx.fillText(mountText, currentX + colWidths[2] / 2, rowY);
			currentX += colWidths[2];

			// 重量
			const weightText = this._calculateWeight(item);
			ctx.fillText(weightText, currentX + colWidths[3] / 2, rowY);
			currentX += colWidths[3];

			// 单价
			ctx.fillText((item.referenceAmount || 0) + '', currentX + colWidths[4] / 2, rowY);
			currentX += colWidths[4];

			// 小计
			const subtotal = parseFloat(item.subtotal || 0);
			totalAmount += subtotal;
			ctx.setTextAlign('right');
			ctx.fillText(subtotal.toFixed(0), amountRightX, rowY);

			y += 45;
		});

		return { y, totalAmount };
	}

	/**
	 * 计算重量显示文本
	 */
	_calculateWeight(item) {
		if (item.type === 2) {
			return '--';
		}
		const totalWeight = parseFloat(item.totalWeight || 0);
		const tareWeight = parseFloat(item.tareWeight || 0);
		const netWeight = (totalWeight - tareWeight).toFixed(2);
		return netWeight + '';
	}

	/**
	 * 绘制表格底边框
	 */
	drawTableFooter(y, tableX, tableWidth) {
		const { ctx } = this;
		ctx.setStrokeStyle('#000000');
		ctx.setLineWidth(2);
		ctx.beginPath();
		ctx.moveTo(tableX, y - 10);
		ctx.lineTo(tableX + tableWidth, y - 10);
		ctx.stroke();
	}

	/**
	 * 绘制合计行
	 */
	drawTotalRow(y, tableX, amountRightX, totalAmount) {
		const { ctx } = this;
		ctx.setFillStyle('#000000');
		ctx.setFontSize(28);
		ctx.setTextAlign('left');
		ctx.fillText('合计', tableX + 60, y + 25);
		ctx.setTextAlign('right');
		ctx.fillText(totalAmount.toFixed(0), amountRightX, y + 25);
		return y + 45;
	}

	/**
	 * 绘制还筐信息
	 */
	drawBasketInfo(y, tableX, amountRightX, basketOffsetNum, basketInfo, order) {
		if (basketOffsetNum <= 0) {
			return y;
		}

		const { ctx } = this;
		const createTime = order.createTime ? order.createTime.replace('T', ' ').substring(0, 16) : '';
		const basketDate = createTime.substring(5, 10);

		ctx.setTextAlign('left');
		ctx.setFontSize(26);
		ctx.fillText(`${basketDate} 还筐`, tableX + 60, y + 20);
		ctx.fillText(basketInfo, tableX + 200, y + 20);
		ctx.setTextAlign('right');
		ctx.fillText('-' + (order.basketOffsetAmount || 0), amountRightX, y + 20);

		return y + 45;
	}

	/**
	 * 绘制本单合计
	 */
	drawFinalTotal(y, amountRightX, finalAmount) {
		const { ctx, canvasWidth, padding } = this;

		y += 30;

		// 分割线
		ctx.setStrokeStyle('#000000');
		ctx.setLineWidth(3);
		ctx.beginPath();
		ctx.moveTo(padding, y - 15);
		ctx.lineTo(canvasWidth - padding, y - 15);
		ctx.stroke();

		// 本单合计
		ctx.setFillStyle('#000000');
		ctx.setFontSize(32);
		ctx.setTextAlign('left');
		ctx.fillText('本单合计：', padding + 20, y + 25);
		ctx.setTextAlign('right');
		ctx.fillText(finalAmount.toFixed(0), amountRightX, y + 25);

		return y + 70;
	}

	/**
	 * 绘制实付/实退金额
	 */
	drawPaymentInfo(y, amountRightX, finalAmount, order) {
		const { ctx } = this;
		const paymentType = this._getPaymentTypeName(order.payType);
		const payLabel = finalAmount >= 0 ? '实付：' : '实退：';
		const payAmount = Math.abs(order.actualMoney || finalAmount);

		ctx.setTextAlign('right');
		ctx.setFontSize(28);
		ctx.fillText(payLabel + payAmount.toFixed(0) + '(' + paymentType + ')', amountRightX, y + 20);

		return y + 45;
	}

	/**
	 * 获取支付方式名称
	 */
	_getPaymentTypeName(payType) {
		const paymentTypes = {
			1: '微信',
			2: '支付宝',
			3: '现金'
		};
		return paymentTypes[payType] || '挂账';
	}

	/**
	 * 绘制底部信息
	 */
	drawFooter(y, companyAddress, companyPhone) {
		const { ctx, canvasWidth, padding } = this;

		// 分割线
		ctx.setStrokeStyle('#000000');
		ctx.setLineWidth(2);
		ctx.beginPath();
		ctx.moveTo(padding, y);
		ctx.lineTo(canvasWidth - padding, y);
		ctx.stroke();
		y += 30;

		// 底部信息
		ctx.setFillStyle('#333333');
		ctx.setFontSize(20);
		ctx.setTextAlign('left');
		ctx.fillText('地址：' + companyAddress + '，联系电话：' + companyPhone, padding, y + 15);
		y += 40;

		return y;
	}

	/**
	 * 绘制Logo
	 */
	drawLogo(y, logoPath, logoWidth, logoHeight) {
		const { ctx, canvasWidth } = this;
		const logoX = (canvasWidth - logoWidth) / 2;
		const logoY = y + 10;
		ctx.drawImage(logoPath, logoX, logoY, logoWidth, logoHeight);
	}

	/**
	 * 计算Logo尺寸
	 */
	static calculateLogoSize(imgInfo) {
		const logoMaxWidth = 200;
		const logoMaxHeight = 80;
		let logoWidth = imgInfo.width;
		let logoHeight = imgInfo.height;

		if (logoWidth > logoMaxWidth || logoHeight > logoMaxHeight) {
			const widthRatio = logoMaxWidth / logoWidth;
			const heightRatio = logoMaxHeight / logoHeight;
			const ratio = Math.min(widthRatio, heightRatio);
			logoWidth = logoWidth * ratio;
			logoHeight = logoHeight * ratio;
		}

		return { logoWidth, logoHeight };
	}
}
