class HardwareInfo {
    constructor(mb, cpu, gpu, ram, rom, network) {
        if(!!mb) {
            this.motherboardAvailable = true;
            this.motherboard = mb;
        }
        if(!!cpu) {
            this.cpuAvailable = true;
            this.cpu = cpu;
        }
        if(!!gpu) {
            this.gpuAvailable = true;
            this.gpu = gpu;
        }
        if(!!ram) {
            this.ramAvailable = true;
            this.ram = ram;
        }
        if(!!(rom?.length)) {
            this.romAvailable = true;
            this.rom = rom;
        }
        if(!!(network?.length)) {
            this.networkAvailable = true;
            this.network = network;
        }

    }
}

class MotherboardInfo {
    constructor(mbData) {
        if(!!mbData.FanRPM) this.fanrpm = mbData.FanRPM.value;
        if(!!mbData.Temperatures && mbData.Temperatures.length) {
            this.temperature1 = mbData.Temperatures[0].value;
            this.temperature2 = mbData.Temperatures[1].value;
        }
    }
}

class CpuInfo {
    constructor(cpuData) {
        if(!!cpuData.Temperature) this.temperature = cpuData.Temperature.value;
        if(!!cpuData.Utilization) this.utilization = cpuData.Utilization.value;
        if(!!cpuData.PowerUsage) this.powerusage = cpuData.PowerUsage.value;
        if(!!cpuData.ClockMhz) this.clockmhz = cpuData.ClockMhz.value;
        if(!!cpuData.Voltage) this.voltage = cpuData.Voltage.value;
        if(!!cpuData.FanRPM) this.fanrpm = cpuData.FanRPM.value;
    }
}

class GpuInfo {
    constructor(gpuData) {
        if(!!gpuData.Temperature) this.temperature = gpuData.Temperature.value;
        if(!!gpuData.HotspotTemperature) this.hotspottemperature = gpuData.HotspotTemperature.value;
        if(!!gpuData.Utilization) this.utilization = gpuData.Utilization.value;
        if(!!gpuData.MemoryUtilization) this.memoryutilization = gpuData.MemoryUtilization.value;
        if(!!gpuData.PowerUsage) this.powerusage = gpuData.PowerUsage.value;
        if(!!gpuData.FanRPM) this.fanrpm = gpuData.FanRPM.value;
    }
}

class RamInfo {
    constructor(ramData) {
        if(!!ramData.Utilization) this.utilization = ramData.Utilization.value;
    }
}

class RomInfo {
    constructor(romData) {
        if(!!(romData?.length)) {
            this.roms = [];
            for(const i of romData) {
                this.roms.push({ name: i.Name, temperature: i.Temperature.value, usedspace: i.UsedSpace.value });
            }
        }
    }
}

class NetworkInfo {
    constructor(netData) {
        if(!!(netData?.length)) {
            this.nets = [];
            for(const i of netData) {
                this.nets += { 
                    name: i.Name, 
                    upSpeed: !!i.UpSpeed ? i.UpSpeed.value : null, 
                    downSpeed: !!i.DownSpeed ? i.DownSpeed.value : null
                };
            }
        }
    }
}

module.exports = { HardwareInfo, CpuInfo, GpuInfo, RamInfo, RomInfo, NetworkInfo, MotherboardInfo };