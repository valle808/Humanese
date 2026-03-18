import 'dart:async';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';

/// Data Streaming Service
/// Handles real-time telemetry from Agent to Kin (Human)
class DataStreamService {
  WebSocketChannel? _channel;
  final StreamController<Map<String, dynamic>> _controller = StreamController.broadcast();

  /// Connect to the Data Stream Server (or P2P relay)
  void connect(String url) {
    _channel = WebSocketChannel.connect(Uri.parse(url));
    print('DataStream: Connected to $url');

    // Subscribe to incoming stream
    _channel!.stream.listen(
      (data) {
        final decoded = jsonDecode(data);
        _controller.add(decoded);
      },
      onError: (error) => print('DataStream Error: $error'),
      onDone: () => print('DataStream Closed'),
    );
  }

  /// Send Telemetry Data
  void sendTelemetry(Map<String, dynamic> data) {
    if (_channel != null) {
      _channel!.sink.add(jsonEncode({
        'type': 'telemetry',
        'timestamp': DateTime.now().toIso8601String(),
        'payload': data,
      }));
    }
  }

  /// Stream of incoming telemetry
  Stream<Map<String, dynamic>> get stream => _controller.stream;

  /// Dispose
  void dispose() {
    _channel?.sink.close();
    _controller.close();
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

