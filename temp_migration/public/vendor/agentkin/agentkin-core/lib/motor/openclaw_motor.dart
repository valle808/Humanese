import 'dart:convert';
import 'package:http/http.dart' as http;
import 'universal_motor.dart';

class OpenClawMotor implements UniversalMotor {
  final String _provider = 'OpenClaw';
  String _baseUrl = 'http://localhost:11434'; // Default to something local?
  String _apiKey = '';
  String _model = 'claw-v1';

  @override
  String get id => 'claw-$_model';

  @override
  String get modelName => _model;

  @override
  String get provider => _provider;

  @override
  Future<void> initialize(Map<String, dynamic> config) async {
    if (config.containsKey('baseUrl')) {
      _baseUrl = config['baseUrl'];
    }
    if (config.containsKey('apiKey')) {
      _apiKey = config['apiKey'];
    }
    if (config.containsKey('model')) {
      _model = config['model'];
    }
  }

  @override
  Future<String> generateResponse(String prompt) async {
    final url = Uri.parse('$_baseUrl/api/generate');
    // Assuming standard completion API or similar
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (_apiKey.isNotEmpty) 'Authorization': 'Bearer $_apiKey',
      },
      body: jsonEncode({
        'model': _model,
        'prompt': prompt,
        'stream': false,
      }),
    );

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return json['response'] ?? json['text'] ?? '';
    } else {
      throw Exception('Failed to generate response: ${response.statusCode} ${response.body}');
    }
  }

  @override
  Stream<String> streamResponse(String prompt) async* {
    yield await generateResponse(prompt);
  }

  @override
  Future<String> analyzeImage(String prompt, List<int> imageBytes) async {
    return "Image analysis not yet implemented for OpenClaw";
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

