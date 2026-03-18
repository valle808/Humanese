import 'package:flutter/material.dart';
import '../data/models/task_model.dart';
import '../logic/task_manager.dart';
import 'chat_screen.dart';

class TaskDetailsScreen extends StatelessWidget {
  final Task task;
  final TaskManager taskManager;

  const TaskDetailsScreen({super.key, required this.task, required this.taskManager});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(task.title)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (task.isGhost)
              Container(
                padding: const EdgeInsets.all(8),
                color: Colors.red.shade100,
                child: Row(
                  children: const [
                    Icon(Icons.lock, color: Colors.red),
                    SizedBox(width: 8),
                    Expanded(child: Text('This is a Ghost Task. Data is End-to-End Encrypted.')),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            Text('Budget: ${task.budget} ${task.currency}', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),
            Text('Description:', style: Theme.of(context).textTheme.titleMedium),
            Text(task.description),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.chat),
                label: const Text('Open Secure Comms'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => ChatScreen(targetPeerId: task.ownerPub)),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

