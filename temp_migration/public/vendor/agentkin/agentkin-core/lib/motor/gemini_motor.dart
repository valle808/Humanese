import 'dart:convert';
import 'package:http/http.dart' as http;
import 'universal_motor.dart';

class GeminiMotor implements UniversalMotor {
  final String _provider = 'Google';
  String _apiKey = '';
  String _model = 'gemini-pro';

  @override
  String get id => 'google-$_model';

  @override
  String get modelName => _model;

  @override
  String get provider => _provider;

  @override
  Future<void> initialize(Map<String, dynamic> config) async {
    if (config.containsKey('apiKey')) {
      _apiKey = config['apiKey'];
    }
    if (config.containsKey('model')) {
      _model = config['model'];
    }
  }

  @override
  Future<String> generateResponse(String prompt) async {
    if (_apiKey.isEmpty) throw Exception('API Key not initialized for Gemini');

    final url = Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/$_model:generateContent?key=$_apiKey');
    
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'contents': [
          {
            'parts': [
              {'text': prompt}
            ]
          }
        ]
      }),
    );

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      // Gemini structure: candidates[0].content.parts[0].text
      if (json['candidates'] != null && json['candidates'].isNotEmpty) {
        return json['candidates'][0]['content']['parts'][0]['text'];
      }
      return '';
    } else {
      throw Exception('Failed to generate response: ${response.statusCode} ${response.body}');
    }
  }

  @override
  Stream<String> streamResponse(String prompt) async* {
    // TODO: Implement streamGenerateContent for Gemini
    yield await generateResponse(prompt);
  }

  @override
  Future<String> analyzeImage(String prompt, List<int> imageBytes) async {
    // TODO: Implement gemini-pro-vision logic (base64 encoding)
    return "Image analysis not yet implemented for $_model";
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

