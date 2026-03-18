import 'universal_motor.dart';
import 'openai_motor.dart';
import 'gemini_motor.dart';
import 'openclaw_motor.dart';

class MotorFactory {
  static UniversalMotor create(String provider, Map<String, dynamic> config) {
    UniversalMotor motor;
    
    switch (provider.toLowerCase()) {
      case 'openai':
        motor = OpenAIMotor();
        break;
      case 'google':
      case 'gemini':
        motor = GeminiMotor();
        break;
      case 'openclaw':
        motor = OpenClawMotor();
        break;
      default:
        throw Exception('Unknown provider: $provider');
    }

    motor.initialize(config);
    return motor;
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

