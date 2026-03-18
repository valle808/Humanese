import 'dart:async';
import 'data_store.dart';

/// GunDB Data Adapter (Simulation)
/// In a real implementation, this would connect to a GunDB relay (Node.js) via WebSocket
/// or use a native Dart P2P library if available.
class GunDBAdapter implements DataStore {
  final Map<String, dynamic> _store = {};
  final _controller = StreamController<Map<String, dynamic>>.broadcast();
  String _peerId = 'peer-init';

  @override
  String get id => _peerId;

  @override
  Future<void> initialize(Map<String, dynamic> config) async {
    if (config.containsKey('peerId')) {
      _peerId = config['peerId'];
    }
    print('GunDB Adapter Initialized for Peer: $_peerId');
  }

  @override
  Future<bool> put(String path, dynamic data) async {
    // Simulate network latency
    await Future.delayed(const Duration(milliseconds: 50));
    _store[path] = data;
    _controller.add({'path': path, 'data': data});
    print('GunDB generic put: $path = $data');
    return true;
  }

  @override
  Future<dynamic> get(String path) async {
    await Future.delayed(const Duration(milliseconds: 50));
    return _store[path];
  }

  @override
  Stream<dynamic> on(String path) {
    return _controller.stream
        .where((event) => event['path'] == path)
        .map((event) => event['data']);
  }

  @override
  Future<bool> delete(String path) async {
    _store.remove(path);
    _controller.add({'path': path, 'data': null}); // Tombstone
    return true;
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

