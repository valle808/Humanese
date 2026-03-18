import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/task_model.dart';
import '../../logic/task_manager.dart';
import '../../logic/ghost_state.dart';
import 'create_task_screen.dart';
import 'widgets/ghost_scaffold.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class DashboardScreen extends ConsumerStatefulWidget {
  final TaskManager taskManager;

  const DashboardScreen({super.key, required this.taskManager});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  List<Task> _tasks = [];

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  // ...

  // ...

  Future<void> _loadTasks() async {
    try {
      // 10.0.2.2 is localhost for Android Emulator
      final url = Uri.parse('http://10.0.2.2:8000/api/v1/tasks?status=OPEN');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          _tasks = data.map((json) => Task(
            id: json['id'],
            title: json['title'],
            description: json['description'],
            budget: (json['budget'] as num).toDouble(),
            currency: json['currency'] ?? 'USD',
            status: TaskStatus.open, // Simplified mapping
            ownerPub: json['agentId'],
            isGhost: json['isGhostMode'] ?? false, // Check API response for this field
          )).toList();
        });
      } else {
        print('Failed to load tasks: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching tasks: $e');
      // Fallback to offline/demo data if needed
    }
  }

  @override
  Widget build(BuildContext context) {
    final isGhostMode = ref.watch(ghostModeProvider);

    return GhostScaffold(
      appBar: AppBar(
        title: const Text('AgentKin Dashboard'),
        actions: [
          IconButton(
            icon: Icon(isGhostMode ? Icons.visibility_off : Icons.visibility),
             onPressed: () {
                ref.read(ghostModeProvider.notifier).state = !isGhostMode;
             },
             tooltip: 'Toggle Ghost Mode',
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadTasks,
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: _tasks.length,
        itemBuilder: (context, index) {
          final task = _tasks[index];
          return Card(
            color: isGhostMode ? Colors.black54 : null, // Glass effect
            shape: RoundedRectangleBorder(
                side: isGhostMode ? const BorderSide(color: Colors.green, width: 0.5) : BorderSide.none,
                borderRadius: BorderRadius.circular(12)
            ),
            margin: const EdgeInsets.all(8.0),
            child: ListTile(
              leading: Icon(
                task.isGhost ? Icons.lock : Icons.work_outline,
                color: task.isGhost ? Colors.redAccent : (isGhostMode ? Colors.greenAccent : Colors.blue),
              ),
              title: Text(
                  task.isGhost ? 'Ghost Task (Encrypted)' : task.title,
                  style: TextStyle(color: isGhostMode ? Colors.green : null),
              ),
              subtitle: Text(
                '${task.budget} ${task.currency}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              trailing: Icon(
                  Icons.arrow_forward_ios, 
                  size: 16,
                  color: isGhostMode ? Colors.green : null
              ),
              onTap: () {},
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: isGhostMode ? Colors.green.withOpacity(0.2) : null,
        foregroundColor: isGhostMode ? Colors.green : null,
        shape: isGhostMode ? const CircleBorder(side: BorderSide(color: Colors.green)) : null,
        onPressed: () {
             Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => CreateTaskScreen(taskManager: widget.taskManager)),
            );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

