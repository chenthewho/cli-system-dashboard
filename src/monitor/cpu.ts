import si from 'systeminformation';
import contrib from 'blessed-contrib';

const colors = ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'];
const MAX_DATA_POINTS = 60;

type CPUData = {
	title: string;
	style: {
		line: string;
	};
	x: number[];
	y: number[];
};

class CpuMonitor {
	lineChart: contrib.Widgets.PictureElement;
	cpuData: CPUData[] = [];
	interval: NodeJS.Timeout | null = null;
	timeCounter = 0;

	constructor(line: contrib.Widgets.PictureElement) {
		this.lineChart = line;
	}

	init() {
		si.currentLoad().then((data) => {
			const initX = Array(MAX_DATA_POINTS).fill(0).map((_, i) => MAX_DATA_POINTS - i);
			const initY = Array(MAX_DATA_POINTS).fill(0);

			// 初始化各个 CPU 数据
			this.cpuData = data.cpus.map((cpu, index) => ({
				title: `CPU${index + 1}`,
				style: {
					line: colors[index % colors.length],
				},
				x: [...initX],
				y: [...initY],
			}));

			// 添加平均 CPU 数据
			this.cpuData.push({
				title: '平均 CPU 占用',
				style: {
					line: 'magenta',
				},
				x: [...initX],
				y: [...initY],
			});

			this.updateData(data);

			this.interval = setInterval(() => {
				si.currentLoad().then((data) => this.updateData(data));
			}, 1000);
		});
	}

	updateData(data: si.Systeminformation.CurrentLoadData) {
		if (!this.cpuData || this.cpuData.length === 0) {
			return;
		}

		const averageLoad = data.cpus.reduce((acc, cpu) => acc + cpu.load, 0) / data.cpus.length;
		const averageCpuIndex = data.cpus.length;

		// 更新各个 CPU 数据
		data.cpus.forEach((cpu, index) => {
			if (this.cpuData[index]) {
				this.cpuData[index].title = `CPU${index + 1}  ${cpu.load.toFixed(1)}%`;
			}
		});

		// 更新平均 CPU 数据
		if (this.cpuData[averageCpuIndex]) {
			this.cpuData[averageCpuIndex].title = `平均: ${averageLoad.toFixed(1)}%`;
			this.cpuData[averageCpuIndex].x.shift();
			this.cpuData[averageCpuIndex].x.push(this.timeCounter);
			this.cpuData[averageCpuIndex].y.shift();
			this.cpuData[averageCpuIndex].y.push(Number(averageLoad.toFixed(1)));
		}

		this.lineChart.setData(this.cpuData);
		this.lineChart.screen.render();
	}
}

export default CpuMonitor;