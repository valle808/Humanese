/// Universal Motor Connector Interface
/// Abstracts the underlying LLM provider (OpenAI, Gemini, OpenClaw)
abstract class UniversalMotor {
  /// Unique identifier for the motor instance
  String get id;

  /// Human-readable name (e.g., "GPT-4o", "Gemini Pro 1.5")
  String get modelName;

  /// Provider name (e.g., "OpenAI", "Google")
  String get provider;

  /// Generates a single response for a prompt
  Future<String> generateResponse(String prompt);

  /// Streams the response for a prompt
  Stream<String> streamResponse(String prompt);

  /// Analyzes an image with a prompt (Multimodal)
  Future<String> analyzeImage(String prompt, List<int> imageBytes);

  /// Initializes the motor with API keys or config
  Future<void> initialize(Map<String, dynamic> config);
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

