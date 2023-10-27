const { HardwareInfo, MotherboardInfo, CpuInfo, GpuInfo, RamInfo, RomInfo, NetworkInfo } = require('../../../models/hardwareModels');
const { settings } = require('../../../../settings-profiler');

const grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

var PROTO_PATH = __dirname + '/hardware.proto';

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var proto_package = grpc.loadPackageDefinition(packageDefinition).hardware;

const client = new proto_package.HardwareService(`${settings.hardware.connection.server}:${settings.hardware.connection.port}`, grpc.credentials.createInsecure());

collectHardwareInfo = (responseCallback) => {
    client.monitorData(new google_protobuf_empty_pb.Empty(), function (err, response) {
        if (err) console.error(err);
        else {
            const model = new HardwareInfo(
                new MotherboardInfo(response.MBInfo),
                new CpuInfo(response.CPUInfo),
                new GpuInfo(response.GPUInfo),
                new RamInfo(response.RAMInfo),
                new RomInfo(response.ROMInfo),
                new NetworkInfo(response.NetInfo))
            responseCallback(model);
        }
    });
}

module.exports = { collectHardwareInfo };