import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'motor/motor_factory.dart';
import 'data/gundb_adapter.dart';
import 'logic/task_manager.dart';
import 'logic/ghost_state.dart';
import 'ui/dashboard.dart';

void main() async {
  // 1. Initialize Motor (Stubbed)
  final motor = MotorFactory.create('openai', {'apiKey': 'sk-proj-placeholder'});
  print('Motor Initialized: ${motor.id}');

  // 2. Initialize Data Layer
  final dataStore = GunDBAdapter();
  await dataStore.initialize({'peerId': 'kin-node-1'});
  
  // 3. Initialize Task Manager
  final taskManager = TaskManager(dataStore);

  // 4. Run App with Riverpod
  runApp(
    ProviderScope(
      child: AgentKinApp(taskManager: taskManager),
    ),
  );
}

class AgentKinApp extends ConsumerWidget {
  final TaskManager taskManager;

  const AgentKinApp({super.key, required this.taskManager});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isGhostMode = ref.watch(ghostModeProvider);

    return MaterialApp(
      title: 'AgentKin Decentralized',
      themeMode: isGhostMode ? ThemeMode.dark : ThemeMode.system,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00BFA5), // Kinship Green
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00FF00), // Alien Green
          brightness: Brightness.dark,
          surface: Colors.black,
        ),
        useMaterial3: true,
      ),
      home: DashboardScreen(taskManager: taskManager),
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

