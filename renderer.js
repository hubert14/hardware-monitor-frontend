const container = document.getElementById('profiles-container');

initAlerts();

window.profilesApi.updateProfiles((e, value) => {
    const loader = document.getElementById('profiles-loader');
    if (!!loader) container.removeChild(loader);
    const profiles = JSON.parse(value).profiles;
    loadProfiles(profiles);
});

window.profilesApi.updateSensor((e, value) => {
    loadSensor(value);
});

window.profilesApi.updateHardware((e, value) => {
    loadHardware(value);
});

loadSensor = (sensor) => {
    const el = document.getElementById('sensor-value');
    const value = format(sensor, 1);
    el.textContent = value;
}

loadHardware = (hardware) => {
    if (hardware.cpuAvailable) updateCpuInfo(hardware.cpu);
    if (hardware.gpuAvailable) updateGpuInfo(hardware.gpu);
    if (hardware.ramAvailable) updateRamInfo(hardware.ram);
    if (hardware.romAvailable) updateRomInfo(hardware.rom);
    if (hardware.motherboardAvailable) updateMbInfo(hardware.motherboard);

    updateDateTime();
}

function updateCpuInfo(cpuInfo) {
    const cpu_temp = document.getElementById('cpu-temp');
    const cpu_clock = document.getElementById('cpu-clock');
    const cpu_util = document.getElementById('cpu-util');
    const cpu_util_bar = document.getElementById('cpu-util-bar');
    const cpu_power = document.getElementById('cpu-power');
    const cpu_voltage = document.getElementById('cpu-voltage');
    const cpu_fan = document.getElementById('cpu-fan');

    cpu_temp.textContent = format(cpuInfo.temperature);
    cpu_clock.textContent = format(cpuInfo.clockmhz);
    cpu_util.textContent = format(cpuInfo.utilization);
    cpu_power.textContent = format(cpuInfo.powerusage);
    cpu_voltage.textContent = format(cpuInfo.voltage, 3);
    cpu_fan.textContent = format(cpuInfo.fanrpm);

    updateChart(cpu_util_bar, format(cpuInfo.utilization));
}

function updateGpuInfo(gpuInfo) {
    const gpu_temp = document.getElementById('gpu-temp');
    const gpu_util = document.getElementById('gpu-util');
    const gpu_util_bar = document.getElementById('gpu-util-bar');
    const gpu_vram_util = document.getElementById('vram-util');
    const gpu_vram_util_bar = document.getElementById('vram-util-bar');
    const gpu_power = document.getElementById('gpu-power');
    const gpu_hotspot = document.getElementById('gpu-hotspot');
    const gpu_fan = document.getElementById('gpu-fan');

    gpu_temp.textContent = format(gpuInfo.temperature);
    gpu_util.textContent = format(gpuInfo.utilization);
    gpu_vram_util.textContent = format(gpuInfo.memoryutilization);
    gpu_power.textContent = format(gpuInfo.powerusage);
    gpu_hotspot.textContent = format(gpuInfo.hotspottemperature);
    gpu_fan.textContent = format(gpuInfo.fanrpm);

    updateChart(gpu_util_bar, format(gpuInfo.utilization));
    updateChart(gpu_vram_util_bar, format(gpuInfo.memoryutilization));
}

function updateRamInfo(ramInfo) {
    const ram_util = document.getElementById('ram-util');
    const ram_util_bar = document.getElementById('ram-util-bar');

    ram_util.textContent = format(ramInfo.utilization);
    updateChart(ram_util_bar, format(ramInfo.utilization));
}

function updateRomInfo(romInfo) {
    const rom_temp1 = document.getElementById('ssd-temp1');
    const rom_temp1_bar = document.getElementById('ssd-temp1-bar');
    const rom_temp2 = document.getElementById('ssd-temp2');
    const rom_temp2_bar = document.getElementById('ssd-temp2-bar');

    if (romInfo.roms.length > 0) {
        rom_temp1.textContent = format(romInfo.roms[0].temperature);
        updateChart(rom_temp1_bar, format(romInfo.roms[0].temperature), true);
    }
    if (romInfo.roms.length > 1) {
        rom_temp2.textContent = format(romInfo.roms[1].temperature);
        updateChart(rom_temp2_bar, format(romInfo.roms[1].temperature), true);
    }
}

function updateMbInfo(mbInfo) {
    const mb_fan = document.getElementById('mb-fan');
    const mb_temp1 = document.getElementById('mb-temp1');
    const mb_temp1_bar = document.getElementById('mb-temp1-bar');
    const mb_temp2 = document.getElementById('mb-temp2');
    const mb_temp2_bar = document.getElementById('mb-temp2-bar');

    mb_fan.textContent = format(mbInfo.fanrpm);
    mb_temp1.textContent = format(mbInfo.temperature1);
    mb_temp2.textContent = format(mbInfo.temperature2);

    updateChart(mb_temp1_bar, format(mbInfo.temperature1), true);
    updateChart(mb_temp2_bar, format(mbInfo.temperature2), true);
}

function updateDateTime() {
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    const d = new Date();
    date.textContent = `${d.getMonth() + 1}\\${d.getDate()}\\${d.getFullYear()}`;
    time.textContent = `${d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`;
}

loadProfiles = (profiles) => {
    for (let item of profiles) {
        const boxId = `profile-${item.steamId}`;
        const avatarId = `${boxId}-avatar`;
        const titleId = `${boxId}-title`;
        const boxClass = `profile-box col-3 profile-${item.statusTitle}`;
        let el = document.getElementById(boxId);
        if (!el) {
            el = document.createElement('div');
            el.setAttribute('id', boxId);
            el.setAttribute('class', boxClass);

            const image = document.createElement('img');
            image.setAttribute('id', avatarId);
            image.setAttribute('src', item.avatar);
            image.setAttribute('class', 'profile-image')
            el.appendChild(image);

            const title = document.createElement('div');
            title.setAttribute('id', titleId);
            title.setAttribute('class', `profile-title`);
            title.textContent = item.nick;
            el.appendChild(title);

            container.appendChild(el);
        }
        else if (el.getAttribute('class') != boxClass) el.setAttribute('class', boxClass);
    }
}

function updateChart(el, val, vertical) {
    el.removeAttribute('style');
    el.setAttribute('style', (!!vertical ? 'height: ' : 'width: ') + val + '%;');
}

function format(num, precise) {
    if (!precise) precise = 0;
    if (!num) return 0;
    return (Math.round(num * 100) / 100).toFixed(precise);
}

function initAlerts() {
    const alertContainer = document.getElementById('alert-container');
    const hardwareContainer = document.getElementById('hardware-container');
    const alertButton = document.getElementById('alert-button');

    alertButton.addEventListener('click', e => {
        if (alertContainer.hasAttribute('hide')) {
            hardwareContainer.setAttribute('hide', 'true');
            alertContainer.removeAttribute('hide');
            alertButton.textContent = 'H';
        }
        else {
            alertContainer.setAttribute('hide', 'true');
            hardwareContainer.removeAttribute('hide');
            alertButton.textContent = 'A';
        }
    });
}