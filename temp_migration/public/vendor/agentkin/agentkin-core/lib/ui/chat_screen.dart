import 'package:flutter/material.dart';
import '../comms/webrtc_service.dart';
import '../comms/data_stream.dart';

class ChatScreen extends StatefulWidget {
  final String targetPeerId;

  const ChatScreen({super.key, required this.targetPeerId});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final WebRTCService _webrtc = WebRTCService();
  final DataStreamService _dataStream = DataStreamService();
  
  bool _inCall = false;

  @override
  void initState() {
    super.initState();
    _initComms();
  }

  Future<void> _initComms() async {
    await _webrtc.initializeMedia();
    // In real app, connect to signaling server
    _dataStream.connect('ws://localhost:8080'); 
  }

  void _toggleCall() async {
    if (_inCall) {
      _webrtc.hangUp();
    } else {
      await _webrtc.makeCall(widget.targetPeerId);
    }
    setState(() => _inCall = !_inCall);
  }

  @override
  void dispose() {
    _webrtc.hangUp();
    _dataStream.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Secure Comms: ${widget.targetPeerId}'),
        actions: [
          IconButton(
            icon: Icon(_inCall ? Icons.call_end : Icons.call),
            color: _inCall ? Colors.red : Colors.green,
            onPressed: _toggleCall,
          ),
          IconButton(
            icon: const Icon(Icons.videocam),
            onPressed: () {
              // Video Call Logic
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: const [
                ListTile(
                  leading: CircleAvatar(child: Icon(Icons.person)),
                  title: Text('Agent: Ready for telemetry.'),
                  subtitle: Text('10:00 AM'),
                ),
              ],
            ),
          ),
          // Telemetry Stream Visualizer
          Container(
            height: 100,
            color: Colors.black87,
            child: StreamBuilder<Map<String, dynamic>>(
              stream: _dataStream.stream,
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Center(child: Text('Waiting for Stream...', style: TextStyle(color: Colors.greenAccent)));
                }
                return Center(
                  child: Text(
                    'LIVE: ${snapshot.data}',
                    style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace'),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                IconButton(icon: const Icon(Icons.send), onPressed: () {}),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

