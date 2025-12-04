import si from 'systeminformation';

si.currentLoad().then((data) => {
	console.log('data', data.cpus);
    console.log('num', data.cpus.length);
}).catch((err) => {
	console.log('err', err);
});