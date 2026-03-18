import 'dart:convert';
import 'package:http/http.dart' as http;
import 'universal_motor.dart';

class OpenAIMotor implements UniversalMotor {
  final String _provider = 'OpenAI';
  String _apiKey = '';
  String _model = 'gpt-4o';

  @override
  String get id => 'openai-$_model';

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
    if (_apiKey.isEmpty) throw Exception('API Key not initialized for OpenAI');

    final url = Uri.parse('https://api.openai.com/v1/chat/completions');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_apiKey',
      },
      body: jsonEncode({
        'model': _model,
        'messages': [
          {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.7,
      }),
    );

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return json['choices'][0]['message']['content'];
    } else {
      throw Exception('Failed to generate response: ${response.statusCode} ${response.body}');
    }
  }

  @override
  Stream<String> streamResponse(String prompt) async* {
    // TODO: Implement SSE streaming for OpenAI
    yield await generateResponse(prompt);
  }

  @override
  Future<String> analyzeImage(String prompt, List<int> imageBytes) async {
    // TODO: Implement GPT-4 Vision logic
    return "Image analysis not yet implemented for $_model";
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

