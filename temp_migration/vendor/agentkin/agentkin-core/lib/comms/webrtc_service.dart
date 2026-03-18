import 'package:flutter_webrtc/flutter_webrtc.dart';

/// WebRTC Service
/// Handles Peer-to-Peer Voice and Video communication
class WebRTCService {
  RTCPeerConnection? _peerConnection;
  MediaStream? _localStream;
  
  // STUN/TURN Servers for NAT traversal
  final Map<String, dynamic> _configuration = {
    'iceServers': [
      {'urls': 'stun:stun.l.google.com:19302'},
    ]
  };

  /// Initialize Local Media Stream
  Future<void> initializeMedia() async {
    final Map<String, dynamic> mediaConstraints = {
      'audio': true,
      'video': {
        'facingMode': 'user',
      }
    };

    _localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    print('WebRTC: Local Media Stream Initialized');
  }

  /// Create Peer Connection (Call Offer)
  Future<void> makeCall(String targetPeerId) async {
    _peerConnection = await createPeerConnection(_configuration);
    
    // Add local tracks to peer connection
    _localStream?.getTracks().forEach((track) {
      _peerConnection!.addTrack(track, _localStream!);
    });

    // Create Offer
    RTCSessionDescription offer = await _peerConnection!.createOffer();
    await _peerConnection!.setLocalDescription(offer);

    // TODO: Send Offer to `targetPeerId` via Signaling (WebSocket/GunDB)
    print('WebRTC: Offer Created for $targetPeerId');
  }

  /// Answer Incoming Call
  Future<void> answerCall(RTCSessionDescription offer) async {
    _peerConnection = await createPeerConnection(_configuration);
    
    // Set Remote Description (Offer)
    await _peerConnection!.setRemoteDescription(offer);

    // Add local tracks
    _localStream?.getTracks().forEach((track) {
      _peerConnection!.addTrack(track, _localStream!);
    });

    // Create Answer
    RTCSessionDescription answer = await _peerConnection!.createAnswer();
    await _peerConnection!.setLocalDescription(answer);

    // TODO: Send Answer via Signaling
    print('WebRTC: Answer Created');
  }

  /// Close Call
  void hangUp() {
    _localStream?.dispose();
    _peerConnection?.close();
    _peerConnection = null;
    print('WebRTC: Call Ended');
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

