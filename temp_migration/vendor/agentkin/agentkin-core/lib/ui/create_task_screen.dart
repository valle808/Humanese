import 'package:flutter/material.dart';
import '../logic/task_manager.dart';
import '../data/encryption.dart';

class CreateTaskScreen extends StatefulWidget {
  final TaskManager taskManager;

  const CreateTaskScreen({super.key, required this.taskManager});

  @override
  State<CreateTaskScreen> createState() => _CreateTaskScreenState();
}

class _CreateTaskScreenState extends State<CreateTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _budgetController = TextEditingController();
  
  bool _isGhost = false;
  String _selectedCurrency = 'SOL';

  Future<void> _submitTask() async {
    if (_formKey.currentState!.validate()) {
      final double budget = double.tryParse(_budgetController.text) ?? 0.0;
      
      try {
        if (_isGhost) {
          final sharedKey = EncryptionService.generateKey();
          await widget.taskManager.createGhostTask(
            title: _titleController.text, // Encrypted internally
            description: _descController.text, // Encrypted internally
            budget: budget,
            currency: _selectedCurrency,
            ownerPub: 'my-pub-key',
            sharedKey: sharedKey,
          );
        } else {
          await widget.taskManager.createTask(
            title: _titleController.text,
            description: _descController.text,
            budget: budget,
            currency: _selectedCurrency,
            ownerPub: 'my-pub-key',
          );
        }
        
        if (mounted) Navigator.pop(context);
        
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Mission')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title'),
                validator: (val) => val!.isEmpty ? 'Required' : null,
              ),
              TextFormField(
                controller: _descController,
                decoration: const InputDecoration(labelText: 'Description'),
                maxLines: 3,
              ),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _budgetController,
                      decoration: const InputDecoration(labelText: 'Budget'),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  DropdownButton<String>(
                    value: _selectedCurrency,
                    items: ['SOL', 'BTC', 'ETH', 'XRP', 'BNB'].map((c) {
                      return DropdownMenuItem(value: c, child: Text(c));
                    }).toList(),
                    onChanged: (val) => setState(() => _selectedCurrency = val!),
                  ),
                ],
              ),
              SwitchListTile(
                title: const Text('Ghost Mode (E2EE) 👻'),
                subtitle: const Text('Content will be encrypted and self-destruct.'),
                value: _isGhost,
                onChanged: (val) => setState(() => _isGhost = val),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitTask,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isGhost ? Colors.red.shade900 : Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: Text(_isGhost ? 'Disavow & Launch' : 'Post Task'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

